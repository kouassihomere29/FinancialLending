import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { insertLoanApplicationSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/user', (req: any, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.json(req.user);
  });

  // Loan application routes (protected)
  app.post("/api/loan-applications", isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertLoanApplicationSchema.parse(req.body);
      const userId = req.user.id;
      const application = await storage.createLoanApplication(validatedData, userId);
      res.json(application);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/loan-applications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const application = await storage.getLoanApplication(id);
      
      if (!application) {
        return res.status(404).json({ message: "Loan application not found" });
      }
      
      res.json(application);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get user's applications
  app.get("/api/loan-applications", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const applications = await storage.getLoanApplicationsByUserId(userId);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all applications (admin only)
  app.get("/api/admin/loan-applications", async (req, res) => {
    try {
      const applications = await storage.getAllLoanApplications();
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin routes for 7-step process management
  app.patch("/api/loan-applications/:id/advance", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { step } = req.body;
      
      if (!step || step < 1 || step > 7) {
        return res.status(400).json({ message: "Invalid step number (1-7)" });
      }
      
      const application = await storage.advanceApplicationStep(id, step);
      
      if (!application) {
        return res.status(404).json({ message: "Loan application not found" });
      }
      
      res.json(application);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/loan-applications/:id/assign-lender", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { lenderId, lenderName } = req.body;
      
      if (!lenderId || !lenderName) {
        return res.status(400).json({ message: "lenderId and lenderName are required" });
      }
      
      const application = await storage.assignLenderToApplication(id, lenderId, lenderName);
      
      if (!application) {
        return res.status(404).json({ message: "Loan application not found" });
      }
      
      res.json(application);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/loan-applications/:id/lender-response", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { response, message } = req.body;
      
      if (!response || !["approved", "rejected"].includes(response)) {
        return res.status(400).json({ message: "response must be 'approved' or 'rejected'" });
      }
      
      const application = await storage.updateLenderResponse(id, response, message);
      
      if (!application) {
        return res.status(404).json({ message: "Loan application not found" });
      }
      
      res.json(application);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/loan-applications/:id/account", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { accountNumber } = req.body;
      
      if (!accountNumber) {
        return res.status(400).json({ message: "accountNumber is required" });
      }
      
      const application = await storage.setAccountNumber(id, accountNumber);
      
      if (!application) {
        return res.status(404).json({ message: "Loan application not found" });
      }
      
      res.json(application);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/loan-applications/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const application = await storage.updateLoanApplicationStatus(id, status);
      
      if (!application) {
        return res.status(404).json({ message: "Loan application not found" });
      }
      
      res.json(application);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Loan calculation endpoint
  app.post("/api/calculate-loan", (req, res) => {
    try {
      const { amount, duration } = req.body;
      
      if (!amount || !duration || amount < 500 || amount > 3000 || duration < 3 || duration > 12) {
        return res.status(400).json({ message: "Invalid loan parameters" });
      }
      
      // Simple loan calculation with 5% annual interest rate
      const annualRate = 0.05;
      const monthlyRate = annualRate / 12;
      const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, duration)) / 
                            (Math.pow(1 + monthlyRate, duration) - 1);
      const totalCost = monthlyPayment * duration;
      
      res.json({
        amount,
        duration,
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        totalCost: Math.round(totalCost * 100) / 100,
        interestRate: annualRate,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

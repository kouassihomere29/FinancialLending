import {
  users,
  type User,
  type UpsertUser,
  loanApplications,
  type LoanApplication,
  type InsertLoanApplication,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Loan application methods
  createLoanApplication(application: InsertLoanApplication, userId: string): Promise<LoanApplication>;
  getLoanApplication(id: number): Promise<LoanApplication | undefined>;
  getLoanApplicationsByUserId(userId: string): Promise<LoanApplication[]>;
  getAllLoanApplications(): Promise<LoanApplication[]>;
  updateLoanApplicationStatus(id: number, status: string): Promise<LoanApplication | undefined>;
  
  // 7-step process methods
  advanceApplicationStep(id: number, step: number): Promise<LoanApplication | undefined>;
  assignLenderToApplication(id: number, lenderId: string, lenderName: string): Promise<LoanApplication | undefined>;
  updateLenderResponse(id: number, response: string, message?: string): Promise<LoanApplication | undefined>;
  setAccountNumber(id: number, accountNumber: string): Promise<LoanApplication | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    try {
      // First try to insert new user
      const [user] = await db
        .insert(users)
        .values({
          ...userData,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      // If insert fails due to conflict, try to update
      const [user] = await db
        .update(users)
        .set({
          ...userData,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userData.id))
        .returning();
      return user;
    }
  }

  async createLoanApplication(insertApplication: InsertLoanApplication, userId: string): Promise<LoanApplication> {
    const [application] = await db
      .insert(loanApplications)
      .values({
        ...insertApplication,
        userId,
        monthlyPayment: insertApplication.monthlyPayment || "0",
        totalCost: insertApplication.totalCost || "0",
        monthlyExpenses: insertApplication.monthlyExpenses || null,
        marketingAccepted: insertApplication.marketingAccepted || false,
      })
      .returning();
    return application;
  }

  async getLoanApplication(id: number): Promise<LoanApplication | undefined> {
    const [application] = await db.select().from(loanApplications).where(eq(loanApplications.id, id));
    return application || undefined;
  }

  async getLoanApplicationsByUserId(userId: string): Promise<LoanApplication[]> {
    return await db.select().from(loanApplications).where(eq(loanApplications.userId, userId));
  }

  async getAllLoanApplications(): Promise<LoanApplication[]> {
    return await db.select().from(loanApplications);
  }

  async updateLoanApplicationStatus(id: number, status: string): Promise<LoanApplication | undefined> {
    const [application] = await db
      .update(loanApplications)
      .set({ 
        status,
        updatedAt: new Date(),
      })
      .where(eq(loanApplications.id, id))
      .returning();
    return application || undefined;
  }

  async advanceApplicationStep(id: number, step: number): Promise<LoanApplication | undefined> {
    const updates: any = {
      currentStep: step,
      status: `step${step}`,
      updatedAt: new Date(),
    };
    
    // Set the completion timestamp for the current step
    if (step === 1) updates.step1CompletedAt = new Date();
    if (step === 2) updates.step2CompletedAt = new Date();
    if (step === 3) updates.step3CompletedAt = new Date();
    if (step === 4) updates.step4CompletedAt = new Date();
    if (step === 5) updates.step5CompletedAt = new Date();
    if (step === 6) updates.step6CompletedAt = new Date();
    if (step === 7) {
      updates.step7CompletedAt = new Date();
      updates.status = 'completed';
    }

    const [application] = await db
      .update(loanApplications)
      .set(updates)
      .where(eq(loanApplications.id, id))
      .returning();
    return application || undefined;
  }

  async assignLenderToApplication(id: number, lenderId: string, lenderName: string): Promise<LoanApplication | undefined> {
    const [application] = await db
      .update(loanApplications)
      .set({ 
        lenderId,
        lenderName,
        updatedAt: new Date(),
      })
      .where(eq(loanApplications.id, id))
      .returning();
    return application || undefined;
  }

  async updateLenderResponse(id: number, response: string, message?: string): Promise<LoanApplication | undefined> {
    const [application] = await db
      .update(loanApplications)
      .set({ 
        lenderResponse: response,
        lenderMessage: message || null,
        updatedAt: new Date(),
      })
      .where(eq(loanApplications.id, id))
      .returning();
    return application || undefined;
  }

  async setAccountNumber(id: number, accountNumber: string): Promise<LoanApplication | undefined> {
    const [application] = await db
      .update(loanApplications)
      .set({ 
        accountNumber,
        updatedAt: new Date(),
      })
      .where(eq(loanApplications.id, id))
      .returning();
    return application || undefined;
  }
}

export const storage = new DatabaseStorage();

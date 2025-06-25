import { users, type User, type InsertUser, loanApplications, type LoanApplication, type InsertLoanApplication } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Loan application methods
  createLoanApplication(application: InsertLoanApplication): Promise<LoanApplication>;
  getLoanApplication(id: number): Promise<LoanApplication | undefined>;
  getAllLoanApplications(): Promise<LoanApplication[]>;
  updateLoanApplicationStatus(id: number, status: string): Promise<LoanApplication | undefined>;
  
  // 7-step process methods
  advanceApplicationStep(id: number, step: number): Promise<LoanApplication | undefined>;
  assignLenderToApplication(id: number, lenderId: string, lenderName: string): Promise<LoanApplication | undefined>;
  updateLenderResponse(id: number, response: string, message?: string): Promise<LoanApplication | undefined>;
  setAccountNumber(id: number, accountNumber: string): Promise<LoanApplication | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createLoanApplication(insertApplication: InsertLoanApplication): Promise<LoanApplication> {
    const [application] = await db
      .insert(loanApplications)
      .values({
        ...insertApplication,
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

  async getAllLoanApplications(): Promise<LoanApplication[]> {
    return await db.select().from(loanApplications);
  }

  async updateLoanApplicationStatus(id: number, status: string): Promise<LoanApplication | undefined> {
    const [application] = await db
      .update(loanApplications)
      .set({ status })
      .where(eq(loanApplications.id, id))
      .returning();
    return application || undefined;
  }
}

export const storage = new DatabaseStorage();

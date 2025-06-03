import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const loanApplications = pgTable("loan_applications", {
  id: serial("id").primaryKey(),
  // Loan details
  amount: integer("amount").notNull(),
  duration: integer("duration").notNull(), // in months
  purpose: text("purpose").notNull(),
  monthlyPayment: text("monthly_payment").notNull(),
  totalCost: text("total_cost").notNull(),
  
  // Personal information
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  
  // Financial information
  employmentStatus: text("employment_status").notNull(),
  monthlyIncome: text("monthly_income").notNull(),
  monthlyExpenses: integer("monthly_expenses"),
  
  // Application status
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  createdAt: timestamp("created_at").defaultNow(),
  
  // Agreements
  termsAccepted: boolean("terms_accepted").notNull().default(false),
  creditCheckAccepted: boolean("credit_check_accepted").notNull().default(false),
  marketingAccepted: boolean("marketing_accepted").notNull().default(false),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertLoanApplicationSchema = createInsertSchema(loanApplications).omit({
  id: true,
  createdAt: true,
}).extend({
  amount: z.number().min(500).max(3000),
  duration: z.number().min(3).max(12),
  purpose: z.string().min(1, "Purpose is required"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  employmentStatus: z.string().min(1, "Employment status is required"),
  monthlyIncome: z.string().min(1, "Monthly income is required"),
  monthlyExpenses: z.number().optional(),
  termsAccepted: z.boolean().refine((val) => val === true, "You must accept the terms and conditions"),
  creditCheckAccepted: z.boolean().refine((val) => val === true, "You must accept the credit check"),
  marketingAccepted: z.boolean().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertLoanApplication = z.infer<typeof insertLoanApplicationSchema>;
export type LoanApplication = typeof loanApplications.$inferSelect;

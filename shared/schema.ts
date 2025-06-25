import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
  
  // Process tracking - 7 steps
  currentStep: integer("current_step").notNull().default(1), // 1-7
  step1CompletedAt: timestamp("step1_completed_at"), // Simulation completed
  step2CompletedAt: timestamp("step2_completed_at"), // Project submitted
  step3CompletedAt: timestamp("step3_completed_at"), // Analysis completed
  step4CompletedAt: timestamp("step4_completed_at"), // Submitted to lender
  step5CompletedAt: timestamp("step5_completed_at"), // Lender response received
  step6CompletedAt: timestamp("step6_completed_at"), // Account opened
  step7CompletedAt: timestamp("step7_completed_at"), // Funds transferred
  
  // Lender information
  lenderId: text("lender_id"), // ID of the assigned lender
  lenderName: text("lender_name"), // Name of the lender
  lenderResponse: text("lender_response"), // approved, rejected, pending
  lenderMessage: text("lender_message"), // Message from lender
  accountNumber: text("account_number"), // Account number at lender
  
  // Application status
  status: text("status").notNull().default("step1"), // step1, step2, ..., step7, completed, rejected
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  
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
  updatedAt: true,
  step1CompletedAt: true,
  step2CompletedAt: true,
  step3CompletedAt: true,
  step4CompletedAt: true,
  step5CompletedAt: true,
  step6CompletedAt: true,
  step7CompletedAt: true,
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

export interface LoanDetails {
  amount: number;
  duration: number;
  purpose: string;
  monthlyPayment: number;
  totalCost: number;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
}

export interface FinancialInfo {
  employmentStatus: string;
  monthlyIncome: string;
  monthlyExpenses?: number;
}

export interface ApplicationAgreements {
  termsAccepted: boolean;
  creditCheckAccepted: boolean;
  marketingAccepted?: boolean;
}

export interface LoanApplication extends LoanDetails, PersonalInfo, FinancialInfo, ApplicationAgreements {
  id?: number;
  status?: 'pending' | 'approved' | 'rejected';
  createdAt?: Date;
}

export interface LoanCalculationRequest {
  amount: number;
  duration: number;
}

export interface LoanCalculationResponse {
  amount: number;
  duration: number;
  monthlyPayment: number;
  totalCost: number;
  interestRate: number;
}

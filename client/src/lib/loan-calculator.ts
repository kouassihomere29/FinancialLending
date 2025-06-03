export interface LoanCalculation {
  monthlyPayment: number;
  totalCost: number;
  interestRate: number;
}

export function calculateLoan(amount: number, durationMonths: number, annualRate: number = 0.05): LoanCalculation {
  // Ensure inputs are valid
  if (amount <= 0 || durationMonths <= 0 || annualRate < 0) {
    throw new Error("Invalid loan parameters");
  }

  const monthlyRate = annualRate / 12;
  
  // Calculate monthly payment using loan formula
  const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, durationMonths)) / 
                        (Math.pow(1 + monthlyRate, durationMonths) - 1);
  
  const totalCost = monthlyPayment * durationMonths;

  return {
    monthlyPayment: Math.round(monthlyPayment),
    totalCost: Math.round(totalCost),
    interestRate: annualRate,
  };
}

export function calculateInterestCost(amount: number, totalCost: number): number {
  return totalCost - amount;
}

export function calculateAPR(amount: number, monthlyPayment: number, durationMonths: number): number {
  // Simplified APR calculation
  const totalRepaid = monthlyPayment * durationMonths;
  const interestPaid = totalRepaid - amount;
  return (interestPaid / amount) * (12 / durationMonths);
}

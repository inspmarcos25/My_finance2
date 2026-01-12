export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string;
  isRecurring?: boolean;
  recurringDay?: number;
}

export interface Goal {
  id: string;
  categoryId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export interface MonthlyStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  categoryBreakdown: {
    categoryId: string;
    amount: number;
  }[];
}

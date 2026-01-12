import { createContext, useState, ReactNode } from 'react';
import { Transaction, MonthlyStats } from '@/types';
import { sampleTransactions, getMonthKey, isCurrentMonth } from '@/services/dataService';

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  getMonthlyStats: (month: Date) => MonthlyStats;
  copyPreviousMonthTransactions: () => void;
  processRecurringTransactions: () => void;
}

export const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const getMonthlyStats = (month: Date): MonthlyStats => {
    const monthKey = getMonthKey(month);
    const monthTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return getMonthKey(tDate) === monthKey;
    });

    const totalIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const categoryBreakdown = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        const existing = acc.find(item => item.categoryId === t.categoryId);
        if (existing) {
          existing.amount += t.amount;
        } else {
          acc.push({ categoryId: t.categoryId, amount: t.amount });
        }
        return acc;
      }, [] as { categoryId: string; amount: number }[]);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      categoryBreakdown,
    };
  };

  const copyPreviousMonthTransactions = () => {
    const now = new Date();
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthKey = getMonthKey(previousMonth);

    const previousTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return getMonthKey(tDate) === previousMonthKey;
    });

    const copiedTransactions = previousTransactions.map(t => ({
      ...t,
      id: `${Date.now()}-${Math.random()}`,
      date: new Date(now.getFullYear(), now.getMonth(), new Date(t.date).getDate()).toISOString(),
    }));

    setTransactions(prev => [...prev, ...copiedTransactions]);
  };

  const processRecurringTransactions = () => {
    const now = new Date();
    const currentMonthKey = getMonthKey(now);

    const recurringTransactions = transactions.filter(t => t.isRecurring);

    const newTransactions: Transaction[] = [];

    recurringTransactions.forEach(t => {
      const alreadyExists = transactions.some(existing => {
        const existingDate = new Date(existing.date);
        return (
          existing.categoryId === t.categoryId &&
          existing.amount === t.amount &&
          getMonthKey(existingDate) === currentMonthKey &&
          existingDate.getDate() === t.recurringDay
        );
      });

      if (!alreadyExists && t.recurringDay) {
        newTransactions.push({
          ...t,
          id: `${Date.now()}-${Math.random()}`,
          date: new Date(now.getFullYear(), now.getMonth(), t.recurringDay).toISOString(),
        });
      }
    });

    if (newTransactions.length > 0) {
      setTransactions(prev => [...prev, ...newTransactions]);
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getMonthlyStats,
        copyPreviousMonthTransactions,
        processRecurringTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

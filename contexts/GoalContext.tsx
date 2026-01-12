import { createContext, useState, ReactNode, useEffect } from 'react';
import { Goal } from '@/types';
import { sampleGoals } from '@/services/dataService';

interface GoalContextType {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'currentAmount'>) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  updateGoalProgress: (categoryId: string, amount: number) => void;
  addAmountToGoal: (id: string, amount: number) => void;
}

export const GoalContext = createContext<GoalContextType | undefined>(undefined);

export function GoalProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>(sampleGoals);

  const addGoal = (goal: Omit<Goal, 'id' | 'currentAmount'>) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      currentAmount: 0,
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev =>
      prev.map(g => (g.id === id ? { ...g, ...updates } : g))
    );
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const updateGoalProgress = (categoryId: string, amount: number) => {
    setGoals(prev =>
      prev.map(g =>
        g.categoryId === categoryId
          ? { ...g, currentAmount: Math.min(g.currentAmount + amount, g.targetAmount) }
          : g
      )
    );
  };

  const addAmountToGoal = (id: string, amount: number) => {
    setGoals(prev =>
      prev.map(g =>
        g.id === id
          ? { ...g, currentAmount: Math.min(g.currentAmount + amount, g.targetAmount) }
          : g
      )
    );
  };

  return (
    <GoalContext.Provider
      value={{
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        updateGoalProgress,
        addAmountToGoal,
      }}
    >
      {children}
    </GoalContext.Provider>
  );
}

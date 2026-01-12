import { useContext } from 'react';
import { GoalContext } from '@/contexts/GoalContext';

export function useGoals() {
  const context = useContext(GoalContext);
  if (!context) {
    throw new Error('useGoals must be used within GoalProvider');
  }
  return context;
}

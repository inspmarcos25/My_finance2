import { Category, Transaction, Goal } from '@/types';

// Categorias padrão
export const defaultCategories: Category[] = [
  { id: '1', name: 'Salário', icon: 'briefcase', color: '#58F4BB', type: 'income' },
  { id: '2', name: 'Investimentos', icon: 'trending-up', color: '#1AEDE7', type: 'income' },
  { id: '3', name: 'Freelance', icon: 'code', color: '#69C7ED', type: 'income' },
  { id: '4', name: 'Alimentação', icon: 'restaurant', color: '#1A6DED', type: 'expense' },
  { id: '5', name: 'Transporte', icon: 'car', color: '#1AB0ED', type: 'expense' },
  { id: '6', name: 'Moradia', icon: 'home', color: '#1ACBED', type: 'expense' },
  { id: '7', name: 'Lazer', icon: 'game-controller', color: '#69C7ED', type: 'expense' },
  { id: '8', name: 'Saúde', icon: 'medical', color: '#58F4BB', type: 'expense' },
];

// Transações de exemplo
export const sampleTransactions: Transaction[] = [
  {
    id: '1',
    description: 'Salário Dezembro',
    amount: 5000,
    type: 'income',
    categoryId: '1',
    date: new Date(2025, 11, 5).toISOString(),
    isRecurring: true,
    recurringDay: 5,
  },
  {
    id: '2',
    description: 'Supermercado',
    amount: 450,
    type: 'expense',
    categoryId: '4',
    date: new Date(2025, 11, 10).toISOString(),
  },
  {
    id: '3',
    description: 'Aluguel',
    amount: 1500,
    type: 'expense',
    categoryId: '6',
    date: new Date(2025, 11, 1).toISOString(),
    isRecurring: true,
    recurringDay: 1,
  },
  {
    id: '4',
    description: 'Uber',
    amount: 45,
    type: 'expense',
    categoryId: '5',
    date: new Date(2025, 11, 15).toISOString(),
  },
  {
    id: '5',
    description: 'Cinema',
    amount: 80,
    type: 'expense',
    categoryId: '7',
    date: new Date(2025, 11, 20).toISOString(),
  },
];

// Metas de exemplo
export const sampleGoals: Goal[] = [
  {
    id: '1',
    categoryId: '4',
    name: 'Reduzir gastos com alimentação',
    targetAmount: 800,
    currentAmount: 0,
    deadline: new Date(2026, 0, 31).toISOString(),
  },
  {
    id: '2',
    categoryId: '7',
    name: 'Controlar gastos com lazer',
    targetAmount: 300,
    currentAmount: 0,
    deadline: new Date(2026, 0, 31).toISOString(),
  },
];

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  }).format(date);
};

export const formatMonthYear = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const getMonthKey = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

export const isCurrentMonth = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
};

export const getMonthName = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
  }).format(date);
};

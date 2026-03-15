import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Transaction, Budget } from '../types';

interface FinanceContextType {
  transactions: Transaction[];
  budgets: Budget[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id' | 'spent'>) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'income',
      amount: 5000,
      category: 'Salary',
      description: 'Monthly salary',
      date: '2026-03-01',
    },
    {
      id: '2',
      type: 'expense',
      amount: 1200,
      category: 'Rent',
      description: 'Monthly rent payment',
      date: '2026-03-01',
    },
    {
      id: '3',
      type: 'expense',
      amount: 250,
      category: 'Groceries',
      description: 'Weekly groceries',
      date: '2026-02-28',
    },
    {
      id: '4',
      type: 'expense',
      amount: 80,
      category: 'Transportation',
      description: 'Gas and metro',
      date: '2026-02-27',
    },
    {
      id: '5',
      type: 'income',
      amount: 500,
      category: 'Freelance',
      description: 'Web design project',
      date: '2026-02-25',
    },
  ]);

  const [budgets, setBudgets] = useState<Budget[]>([
    { id: '1', category: 'Groceries', limit: 500, spent: 250, period: 'monthly' },
    { id: '2', category: 'Entertainment', limit: 200, spent: 120, period: 'monthly' },
    { id: '3', category: 'Transportation', limit: 300, spent: 80, period: 'monthly' },
    { id: '4', category: 'Dining', limit: 250, spent: 0, period: 'monthly' },
  ]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);

    // Update budget spent amount if it's an expense
    if (transaction.type === 'expense') {
      setBudgets((prev) =>
        prev.map((budget) =>
          budget.category === transaction.category
            ? { ...budget, spent: budget.spent + transaction.amount }
            : budget
        )
      );
    }
  };

  const deleteTransaction = (id: string) => {
    const transaction = transactions.find((t) => t.id === id);
    if (transaction && transaction.type === 'expense') {
      // Update budget spent amount
      setBudgets((prev) =>
        prev.map((budget) =>
          budget.category === transaction.category
            ? { ...budget, spent: Math.max(0, budget.spent - transaction.amount) }
            : budget
        )
      );
    }
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const addBudget = (budget: Omit<Budget, 'id' | 'spent'>) => {
    const newBudget = {
      ...budget,
      id: Date.now().toString(),
      spent: 0,
    };
    setBudgets((prev) => [...prev, newBudget]);
  };

  const updateBudget = (id: string, budget: Partial<Budget>) => {
    setBudgets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...budget } : b))
    );
  };

  const deleteBudget = (id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        budgets,
        addTransaction,
        deleteTransaction,
        addBudget,
        updateBudget,
        deleteBudget,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}

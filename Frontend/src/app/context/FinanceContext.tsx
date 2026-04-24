import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { Transaction, Budget } from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8081') + '/api';

interface FinanceContextType {
  transactions: Transaction[];
  budgets: Budget[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addBudget: (budget: Omit<Budget, 'id' | 'spent'>) => Promise<void>;
  updateBudget: (id: string, budget: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  const refreshData = async () => {
    try {
      const [transactionsRes, budgetsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/transactions`),
        axios.get(`${API_BASE_URL}/budgets`)
      ]);
      setTransactions(transactionsRes.data);
      setBudgets(budgetsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      await axios.post(`${API_BASE_URL}/transactions`, transaction);
      await refreshData(); // Refresh to get updated budgets too
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/transactions/${id}`);
      await refreshData();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const addBudget = async (budget: Omit<Budget, 'id' | 'spent'>) => {
    try {
      await axios.post(`${API_BASE_URL}/budgets`, { ...budget, spent: 0 });
      await refreshData();
    } catch (error) {
      console.error('Error adding budget:', error);
    }
  };

  const updateBudget = async (id: string, budget: Partial<Budget>) => {
    try {
      const existing = budgets.find(b => b.id === id);
      if (existing) {
        await axios.put(`${API_BASE_URL}/budgets/${id}`, { ...existing, ...budget });
        await refreshData();
      }
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/budgets/${id}`);
      await refreshData();
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
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
        refreshData,
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

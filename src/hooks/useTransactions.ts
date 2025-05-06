import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { Transaction } from "@/types/transaction";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await api.getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    try {
      const newTransaction = await api.createTransaction(transaction);
      setTransactions((prev) => [...prev, newTransaction]);
      return newTransaction;
    } catch (error) {
      console.error("Erro ao adicionar transação:", error);
      throw error;
    }
  };

  const updateTransaction = async (
    id: string,
    transaction: Partial<Transaction>,
  ) => {
    try {
      const updatedTransaction = await api.updateTransaction(id, transaction);
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? updatedTransaction : t)),
      );
      return updatedTransaction;
    } catch (error) {
      console.error("Erro ao atualizar transação:", error);
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await api.deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Erro ao deletar transação:", error);
      throw error;
    }
  };

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions: loadTransactions,
  };
}

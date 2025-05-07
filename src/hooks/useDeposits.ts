import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { Transaction } from "@/types/transaction";
import { auth } from "@/lib/auth";

export interface Deposit {
  id: string;
  amount: number;
  createdAt: string;
}

export function useDeposits() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeposits();
  }, []);

  const loadDeposits = async () => {
    try {
      const user = auth.getCurrentUser();
      if (!user) throw new Error("Usuário não autenticado");

      const transactions = await api.getTransactions();
      const depositsData = transactions.filter(
        (t) =>
          t.type === "income" &&
          t.category === "deposit" &&
          t.userId === user.id,
      );

      setDeposits(
        depositsData.map((d) => ({
          id: d.id,
          amount: d.amount,
          createdAt: d.date,
        })),
      );

      const totalBalance = transactions.reduce((acc, curr) => {
        if (curr.userId === user.id) {
          return acc + (curr.type === "income" ? curr.amount : -curr.amount);
        }
        return acc;
      }, 0);

      setBalance(totalBalance);
    } catch (error) {
      console.error("Erro ao carregar depósitos:", error);
    } finally {
      setLoading(false);
    }
  };

  const addDeposit = async (amount: number) => {
    try {
      const user = auth.getCurrentUser();
      if (!user) throw new Error("Usuário não autenticado");

      const newDeposit: Omit<Transaction, "id"> = {
        description: "Depósito",
        amount,
        type: "income",
        category: "deposit",
        date: new Date().toISOString(),
        userId: user.id,
      };

      await api.createTransaction(newDeposit);
      await loadDeposits();
    } catch (error) {
      console.error("Erro ao adicionar depósito:", error);
      throw error;
    }
  };

  const reverseDeposit = async (id: string) => {
    try {
      const user = auth.getCurrentUser();
      if (!user) throw new Error("Usuário não autenticado");

      const transaction = await api
        .getTransactions()
        .then((transactions) => transactions.find((t) => t.id === id));

      if (!transaction || transaction.userId !== user.id) {
        throw new Error("Transação não encontrada ou não autorizada");
      }

      await api.deleteTransaction(id);
      await loadDeposits();
    } catch (error) {
      console.error("Erro ao reverter depósito:", error);
      throw error;
    }
  };

  return {
    deposits,
    balance,
    loading,
    addDeposit,
    reverseDeposit,
    refreshDeposits: loadDeposits,
  };
}

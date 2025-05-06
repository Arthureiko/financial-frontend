import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { Transaction } from "@/types/transaction";

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
      const transactions = await api.getTransactions();
      const depositsData = transactions.filter((t) => t.type === "income");
      setDeposits(
        depositsData.map((d) => ({
          id: d.id,
          amount: d.amount,
          createdAt: d.date,
        })),
      );

      const totalBalance = transactions.reduce((acc, curr) => {
        return acc + (curr.type === "income" ? curr.amount : -curr.amount);
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
      const newDeposit: Omit<Transaction, "id"> = {
        description: "Depósito",
        amount,
        type: "income",
        category: "deposit",
        date: new Date().toISOString(),
      };

      await api.createTransaction(newDeposit);
      await loadDeposits(); // Recarrega os dados após adicionar um novo depósito
    } catch (error) {
      console.error("Erro ao adicionar depósito:", error);
      throw error;
    }
  };

  const reverseDeposit = async (id: string) => {
    try {
      await api.deleteTransaction(id);
      await loadDeposits(); // Recarrega os dados após reverter o depósito
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

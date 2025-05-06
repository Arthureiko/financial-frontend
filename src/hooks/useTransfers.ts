import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { Transaction } from "@/types/transaction";

export interface Transfer {
  id: string;
  amount: number;
  targetUserId: string;
  createdAt: string;
}

export function useTransfers() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransfers = async () => {
      try {
        const transactions = await api.getTransactions();
        const transfersData = transactions.filter(
          (t) => t.type === "expense" && t.category === "transfer",
        );
        setTransfers(
          transfersData.map((t) => ({
            id: t.id,
            amount: t.amount,
            targetUserId: t.description.split(" - ")[1] || "",
            createdAt: t.date,
          })),
        );
      } catch (error) {
        console.error("Erro ao carregar transferências:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTransfers();
  }, []);

  const addTransfer = async (amount: number, targetUserId: string) => {
    try {
      const newTransfer: Omit<Transaction, "id"> = {
        description: `Transferência - ${targetUserId}`,
        amount,
        type: "expense",
        category: "transfer",
        date: new Date().toISOString(),
      };

      await api.createTransaction(newTransfer);

      // Recarrega as transferências após adicionar uma nova
      const transactions = await api.getTransactions();
      const transfersData = transactions.filter(
        (t) => t.type === "expense" && t.category === "transfer",
      );
      setTransfers(
        transfersData.map((t) => ({
          id: t.id,
          amount: t.amount,
          targetUserId: t.description.split(" - ")[1] || "",
          createdAt: t.date,
        })),
      );
    } catch (error) {
      console.error("Erro ao adicionar transferência:", error);
      throw error;
    }
  };

  return {
    transfers,
    loading,
    addTransfer,
  };
}

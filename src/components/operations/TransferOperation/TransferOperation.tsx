"use client";

import { useState } from "react";
import { Button, Input } from "@/components/core";
import styles from "./TransferOperation.module.css";

interface TransferData {
  amount: number;
  targetUserId: string;
}

interface TransferOperationProps {
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
}

export const TransferOperation = ({
  onError,
  onSuccess,
}: TransferOperationProps) => {
  const [amount, setAmount] = useState<string>("");
  const [targetUserId, setTargetUserId] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const transferData: TransferData = {
        amount: parseFloat(amount),
        targetUserId,
      };

      const response = await fetch("/api/operations/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transferData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      onSuccess("Transferência realizada com sucesso!");
      setAmount("");
      setTargetUserId("");
    } catch (error) {
      onError(
        error instanceof Error
          ? error.message
          : "Erro ao realizar transferência"
      );
    }
  };

  return (
    <div className={styles.transferContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Valor da transferência"
          label="Valor da Transferência"
          required
        />
        <Input
          type="text"
          value={targetUserId}
          onChange={(e) => setTargetUserId(e.target.value)}
          placeholder="ID do usuário destinatário"
          label="ID do Usuário Destinatário"
          required
        />
        <Button
          type="submit"
          variant="container"
          width="20%"
          style={{ marginTop: "16px" }}
        >
          Realizar Transferência
        </Button>
      </form>
    </div>
  );
};

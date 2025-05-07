"use client";

import { useState } from "react";
import { Button, Input, Typography } from "@/components/core";
import { useTransfers } from "@/hooks/useTransfers";
import { useDeposits } from "@/hooks/useDeposits";
import styles from "./TransferOperation.module.css";

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
  const { transfers, loading, addTransfer } = useTransfers();
  const { balance } = useDeposits();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const transferAmount = parseFloat(amount);
      if (isNaN(transferAmount) || transferAmount <= 0) {
        throw new Error("Valor inválido para transferência");
      }

      if (!targetUserId.trim()) {
        throw new Error("ID do usuário destinatário é obrigatório");
      }

      if (transferAmount > balance) {
        throw new Error("Saldo insuficiente para realizar a transferência");
      }

      addTransfer(transferAmount, targetUserId);
      onSuccess("Transferência realizada com sucesso!");
      setAmount("");
      setTargetUserId("");
    } catch (error) {
      onError(
        error instanceof Error
          ? error.message
          : "Erro ao realizar transferência",
      );
    }
  };

  if (loading) {
    return <Typography>Carregando...</Typography>;
  }

  return (
    <div className={styles.transferContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.transferForm}>
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
              width="50%"
              style={{ marginTop: "16px" }}
            >
              Realizar Transferência
            </Button>
          </form>
        </div>

        <div className={styles.transfersTable}>
          <Typography variant="h3" style={{ marginBottom: "16px" }}>
            Histórico de Transferências
          </Typography>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>
                  <Typography variant="h5">Data</Typography>
                </th>
                <th className={styles.tableHeader}>
                  <Typography variant="h5">Valor</Typography>
                </th>
                <th className={styles.tableHeader}>
                  <Typography variant="h5">Destinatário</Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((transfer) => (
                <tr key={transfer.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <Typography variant="body">
                      {new Date(transfer.createdAt).toLocaleDateString()}
                    </Typography>
                  </td>
                  <td className={styles.tableCell}>
                    <Typography variant="body" color="#e91e63">
                      R$ {transfer.amount.toFixed(2)}
                    </Typography>
                  </td>
                  <td className={styles.tableCell}>
                    <Typography variant="body">
                      {transfer.targetUserId}
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

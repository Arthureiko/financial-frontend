"use client";

import { useState, useEffect } from "react";
import { Typography, Button, Input } from "@/components/core";
import { Modal } from "@/components/core/modal";
import styles from "./DepositOperation.module.css";

interface Deposit {
  id: string;
  amount: number;
  createdAt: string;
}

interface DepositData {
  amount: number;
}

interface ReversalData {
  operationId: string;
}

interface DepositOperationProps {
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
}

export const DepositOperation = ({
  onError,
  onSuccess,
}: DepositOperationProps) => {
  const [amount, setAmount] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [modal, setModal] = useState<{
    open: boolean;
    title: string;
    content: string;
    variant: "success" | "danger";
  }>({
    open: false,
    title: "",
    content: "",
    variant: "success",
  });

  const fetchBalance = async () => {
    try {
      const response = await fetch("/api/user/balance", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance);
      }
    } catch (error) {
      console.error("Erro ao buscar saldo:", error);
    }
  };

  const fetchDeposits = async () => {
    try {
      const response = await fetch("/api/operations/deposits", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setDeposits(data);
      }
    } catch (error) {
      console.error("Erro ao buscar depósitos:", error);
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchDeposits();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const depositData: DepositData = {
        amount: parseFloat(amount),
      };

      const response = await fetch("/api/operations/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(depositData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      onSuccess("Depósito realizado com sucesso!");
      setAmount("");
      fetchBalance();
      fetchDeposits();
    } catch (error) {
      onError(
        error instanceof Error ? error.message : "Erro ao realizar depósito"
      );
    }
  };

  const handleReversal = async (operationId: string) => {
    try {
      const reversalData: ReversalData = {
        operationId,
      };

      const response = await fetch("/api/operations/reverse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(reversalData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      onSuccess("Depósito revertido com sucesso!");
      fetchBalance();
      fetchDeposits();
    } catch (error) {
      onError(
        error instanceof Error ? error.message : "Erro ao reverter depósito"
      );
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setModal({
      open: true,
      title: "Sucesso",
      content: "ID copiado para a área de transferência!",
      variant: "success",
    });
  };

  return (
    <div className={styles.depositContainer}>
      <Modal
        open={modal.open}
        onClose={() => setModal({ ...modal, open: false })}
        title={modal.title}
        content={modal.content}
        variant={modal.variant}
      />

      <div className={styles.balanceContainer}>
        <Typography variant="h3" size={2}>
          Saldo Atual
        </Typography>
        <Typography variant="h2" color="#e91e63" size={2}>
          R$ {balance.toFixed(2)}
        </Typography>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.depositForm}>
          <form onSubmit={handleSubmit}>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Valor do depósito"
              label="Valor do Depósito"
              required
            />
            <Button
              type="submit"
              variant="container"
              width="50%"
              style={{ marginTop: "16px" }}
            >
              Depositar
            </Button>
          </form>
        </div>

        <div className={styles.depositsTable}>
          <Typography variant="h3" style={{ marginBottom: "16px" }}>
            Histórico de Depósitos
          </Typography>
          <table>
            <thead>
              <tr>
                <th>
                  <Typography variant="h5">Data</Typography>
                </th>
                <th>
                  <Typography variant="h5">Valor</Typography>
                </th>
                <th>
                  <Typography variant="h5">ID</Typography>
                </th>
                <th>
                  <Typography variant="h5">Ações</Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {deposits.map((deposit) => (
                <tr key={deposit.id}>
                  <td>
                    <Typography variant="body">
                      {new Date(deposit.createdAt).toLocaleDateString()}
                    </Typography>
                  </td>
                  <td>
                    <Typography variant="body" color="#e91e63">
                      R$ {deposit.amount.toFixed(2)}
                    </Typography>
                  </td>
                  <td>
                    <div className={styles.idContainer}>
                      <span className={styles.idText}>{deposit.id}</span>
                      <Button
                        variant="text"
                        onClick={() => copyToClipboard(deposit.id)}
                        style={{ padding: "4px 8px" }}
                      >
                        Copiar
                      </Button>
                    </div>
                  </td>
                  <td>
                    <Button
                      variant="outline"
                      onClick={() => handleReversal(deposit.id)}
                      style={{ padding: "4px 8px" }}
                    >
                      Reverter
                    </Button>
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

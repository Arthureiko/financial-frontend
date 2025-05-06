"use client";

import { useState } from "react";
import { Typography, Button } from "@/components/core";
import { Modal } from "@/components/core/modal";
import { DepositOperation } from "../DepositOperation/DepositOperation";
import { TransferOperation } from "../TransferOperation/TransferOperation";
import styles from "./FinancialOperations.module.css";

type TabType = "deposit" | "transfer";

export const FinancialOperations = () => {
  const [activeTab, setActiveTab] = useState<TabType>("deposit");
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

  const handleError = (message: string) => {
    setModal({
      open: true,
      title: "Erro",
      content: message,
      variant: "danger",
    });
  };

  const handleSuccess = (message: string) => {
    setModal({
      open: true,
      title: "Sucesso",
      content: message,
      variant: "success",
    });
  };

  return (
    <div className={styles.operationsContainer}>
      <Modal
        open={modal.open}
        onClose={() => setModal({ ...modal, open: false })}
        title={modal.title}
        content={modal.content}
        variant={modal.variant}
      />

      <div className={styles.tabs}>
        <Button
          variant={activeTab === "deposit" ? "container" : "outline"}
          onClick={() => setActiveTab("deposit")}
        >
          Depósitos
        </Button>
        <Button
          variant={activeTab === "transfer" ? "container" : "outline"}
          onClick={() => setActiveTab("transfer")}
        >
          Transferências
        </Button>
      </div>

      {activeTab === "deposit" ? (
        <DepositOperation onError={handleError} onSuccess={handleSuccess} />
      ) : (
        <TransferOperation onError={handleError} onSuccess={handleSuccess} />
      )}
    </div>
  );
};

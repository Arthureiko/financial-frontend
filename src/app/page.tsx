"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Typography, Button, Modal } from "@/components/core";
import { useAuth } from "@/hooks/useAuth";
import styles from "./page.module.css";

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [showModal, setShowModal] = useState<{
    show: boolean;
    type: "success" | "danger";
    message?: string;
  }>({
    show: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className={styles.pageInner}>
        <div className={styles.loading}>
          <Typography variant="body" size={1.8}>
            Carregando...
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageInner}>
      <main className={styles.main}>
        <div className={styles.form}>
          <Image
            className={styles.logo}
            src="/ac.webp"
            alt="Logo Starbem."
            width={175}
            height={175}
            priority
          />
          <div className={styles.header}>
            <Typography variant="h1" size={3.6}>
              Bem-vindo ao Portal Financeiro
            </Typography>
            <Typography variant="body" size={1.8} color="#786F8D">
              Seu guia para realizar transferência de saldo e depósito
            </Typography>
          </div>
          <div className={styles.buttons}>
            <Button
              aria-label="Ir para Login"
              onClick={() => router.push("/login")}
              variant="container"
            >
              Entrar
            </Button>

            <Button
              aria-label="Criar conta"
              onClick={() => router.push("/register")}
              variant="outline"
            >
              Criar conta
            </Button>
          </div>
        </div>
      </main>

      <Modal
        open={showModal?.show}
        title={
          showModal?.type === "success"
            ? "Oba, tudo certo!"
            : "Ops, algo deu errado!"
        }
        variant={showModal.type || "success"}
        content={showModal.message || ""}
        onClose={() => {
          setShowModal({ show: false, type: "success" });
        }}
      />
    </div>
  );
}

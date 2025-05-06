"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input, Typography, Button, Modal } from "@/components/core";
import { validateEmail, validatePassword } from "@/utils/validation";
import { useAuth } from "@/hooks/useAuth";
import styles from "./page.module.css";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [touchedFields, setTouchedFields] = useState({
    email: false,
    password: false,
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [showModal, setShowModal] = useState<{
    show: boolean;
    type: "success" | "danger";
    message?: string;
  }>({
    show: false,
    type: "success",
    message: "",
  });

  const handleFieldBlur = (field: keyof typeof touchedFields) => {
    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  useEffect(() => {
    const validateFields = () => {
      const newErrors = {
        email: touchedFields.email ? validateEmail(formData.email) : "",
        password: touchedFields.password
          ? validatePassword(formData.password)
          : "",
      };

      setErrors(newErrors);

      const isValid =
        !newErrors.email &&
        !newErrors.password &&
        formData.email !== "" &&
        formData.password !== "";

      setIsFormValid(isValid);
    };

    validateFields();
  }, [formData, touchedFields]);

  const handleSubmit = async () => {
    setTouchedFields({
      email: true,
      password: true,
    });

    if (!isFormValid) return;

    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      router.push("/dashboard");
    } catch (error) {
      setShowModal({
        show: true,
        type: "danger",
        message:
          error instanceof Error ? error.message : "Erro ao realizar login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
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
            Login
          </Typography>
          <Typography variant="body" size={1.8} color="#786F8D">
            Entre com sua conta
          </Typography>
        </div>

        <Input
          label="E-mail"
          placeholder="Digite seu e-mail"
          type="email"
          value={formData.email}
          onChange={(event) =>
            setFormData({
              ...formData,
              email: (event.target as HTMLInputElement).value,
            })
          }
          onBlur={() => handleFieldBlur("email")}
          error={touchedFields.email ? errors.email : ""}
          maxLength={50}
          disabled={isLoading}
        />

        <div className={styles.inputContainerMt}>
          <Input
            label="Senha"
            placeholder="Digite sua senha"
            type="password"
            value={formData.password}
            onChange={(event) =>
              setFormData({
                ...formData,
                password: (event.target as HTMLInputElement).value,
              })
            }
            onBlur={() => handleFieldBlur("password")}
            error={touchedFields.password ? errors.password : ""}
            maxLength={50}
            disabled={isLoading}
          />
        </div>

        <Button
          aria-label="Entrar"
          onClick={handleSubmit}
          variant="container"
          disabled={!isFormValid || isLoading}
          loading={isLoading}
          loadingText="Entrando..."
        >
          Entrar
        </Button>

        <div className={styles.recover}>
          <Button
            aria-label="Criar conta"
            onClick={() => router.push("/register")}
            className={styles.button}
          >
            <Typography variant="body" size={1.6} weight={400} color="#E81F76">
              Criar conta
            </Typography>
          </Button>
        </div>

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
    </div>
  );
}

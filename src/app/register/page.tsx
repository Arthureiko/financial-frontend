"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { emailIsValid } from "js-essential-kit";
import { Input, Typography, Button, Modal } from "@/components/core";
import { useAuth } from "@/hooks/useAuth";
import styles from "./page.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [touchedFields, setTouchedFields] = useState({
    name: false,
    email: false,
    password: false,
  });

  const [errors, setErrors] = useState({
    name: "",
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
        name: "",
        email: "",
        password: "",
      };

      if (touchedFields.name) {
        if (!formData.name || formData.name.length < 3) {
          newErrors.name = "O nome deve ter no mínimo 3 caracteres";
        }
      }

      if (touchedFields.email) {
        if (!formData.email || !emailIsValid(formData.email)) {
          newErrors.email = "E-mail inválido";
        }
      }

      if (touchedFields.password) {
        if (!formData.password || formData.password.length < 6) {
          newErrors.password = "A senha deve ter no mínimo 6 caracteres";
        }
      }

      setErrors(newErrors);

      const isValid =
        formData.name.length >= 3 &&
        emailIsValid(formData.email) &&
        formData.password.length >= 6 &&
        !Object.values(newErrors).some((error) => error !== "");

      setIsFormValid(isValid);
    };

    validateFields();
  }, [formData, touchedFields]);

  const handleSubmit = async () => {
    setTouchedFields({
      name: true,
      email: true,
      password: true,
    });

    if (!isFormValid) return;

    setIsLoading(true);
    try {
      register(formData.email, formData.password, formData.name);
      setShowModal({
        show: true,
        type: "success",
        message: "Cadastro realizado com sucesso!",
      });
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      setShowModal({
        show: true,
        type: "danger",
        message:
          error instanceof Error ? error.message : "Erro ao realizar cadastro",
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
            Cadastro
          </Typography>
          <Typography variant="body" size={1.8} color="#786F8D">
            Crie sua conta para começar
          </Typography>
        </div>

        <Input
          label="Nome"
          placeholder="Digite seu nome"
          type="text"
          value={formData.name}
          onChange={(event) =>
            setFormData({
              ...formData,
              name: (event.target as HTMLInputElement).value,
            })
          }
          onBlur={() => handleFieldBlur("name")}
          error={touchedFields.name ? errors.name : ""}
          maxLength={50}
          disabled={isLoading}
        />

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
          aria-label="Criar conta"
          onClick={handleSubmit}
          variant="container"
          disabled={!isFormValid || isLoading}
          loading={isLoading}
          loadingText="Criando conta..."
        >
          Criar conta
        </Button>

        <div className={styles.recover}>
          <Button
            aria-label="Voltar para login"
            onClick={() => router.push("/login")}
            className={styles.button}
          >
            <Typography variant="body" size={1.6} weight={400} color="#E81F76">
              Voltar para login
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

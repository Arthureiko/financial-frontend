"use client";

import React, { useState } from "react";
import styles from "./input.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface InputProps {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  type = "text",
  ...props
}: InputProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputContainer}>
        <input
          {...props}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          className={styles.input}
        />
        {type === "password" && (
          <button
            type="button"
            name="password"
            id="eyePassword"
            className={styles.passwordToggle}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {!showPassword ? (
              <FaEyeSlash style={{ fontSize: "16px" }} />
            ) : (
              <FaEye />
            )}
          </button>
        )}
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}

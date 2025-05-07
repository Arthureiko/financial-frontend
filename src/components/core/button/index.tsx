import React from "react";
import styles from "./button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  width?: string;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  buttonStyle?: React.CSSProperties;
  textColor?: string;
  fontSize?: string;
  loading?: boolean;
  loadingText?: string;
  backgroundColor?: string;
  variant?: "container" | "outline" | "text" | "back";
  children: React.ReactNode;
}

export function Button({
  width,
  leftIcon,
  rightIcon,
  textColor,
  backgroundColor,
  variant = "container",
  children,
  fontSize,
  loading = false,
  loadingText,
  style,
  ...props
}: ButtonProps) {
  const buttonClasses = [styles.button, styles[variant]]
    .filter(Boolean)
    .join(" ");

  const bStyle = {
    "--button-width": width,
    "--button-text-color": textColor,
    "--button-background-color": backgroundColor,
    "--button-font-size": fontSize,
    ...style,
  } as React.CSSProperties;

  return (
    <button
      className={buttonClasses}
      style={bStyle}
      {...props}
      aria-label={variant}
    >
      {leftIcon && leftIcon}
      {loading ? (loadingText ? loadingText : "Carregando..") : children}
      {rightIcon && rightIcon}
    </button>
  );
}

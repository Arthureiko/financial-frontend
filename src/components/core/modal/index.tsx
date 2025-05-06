import { Typography } from "@/components/core";

import styles from "./modal.module.css";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
  variant?: "success" | "danger";
}

export function Modal({
  open,
  onClose,
  title,
  content,
  variant = "success",
}: ModalProps) {
  if (!open) return null;

  const ModalClasses = [
    styles.modal,
    variant === "success" && styles.success,
    variant === "danger" && styles.danger,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.overlay}>
      <div className={ModalClasses}>
        <div className={styles.header}>
          <div className={styles.text}>
            <Typography variant="h1" size={3}>
              {title}
            </Typography>
          </div>
        </div>
        <div className={styles.body}>
          <Typography size={1.6} color="#443D58">
            {content}
          </Typography>
        </div>
        <div className={styles.footer}>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Fechar"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

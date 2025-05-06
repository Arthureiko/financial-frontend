import styles from "./page.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cadastro de conta",
  description: "Realize transferência de saldo e depósito.",
  robots: {
    index: false,
    follow: true,
    nocache: true,
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className={styles.page}>
      <div className={styles.rightContent}>{children}</div>
    </section>
  );
}

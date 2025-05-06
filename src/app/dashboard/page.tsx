"use client";

import { Header } from "@/components/core/Header";
import { FinancialOperations } from "@/components/operations/FinancialOperations/FinancialOperations";
import styles from "./page.module.css";

const Page = () => {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <FinancialOperations />
      </div>
    </>
  );
};

export default Page;

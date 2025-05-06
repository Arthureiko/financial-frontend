import React from "react";
import { usePathname } from "next/navigation";
import { Typography } from "@/components/core";

import styles from "./index.module.css";

export function Header() {
  const pathname = usePathname();
  const currentDate = new Date();

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString("pt-BR", { month: "long" });
    const year = date.getFullYear();

    return `${day} de ${month} de ${year}`;
  };

  const getPageTitle = (path: string) => {
    const pathMap: { [key: string]: string } = {
      "/dashboard": "Financeiro",
    };

    return pathMap[path] || "Página";
  };

  return (
    <header className={styles.header}>
      <Typography variant="h2" size={3}>
        {getPageTitle(pathname || "/")}
      </Typography>
      <Typography variant="body" size={1.2}>
        {formatDate(currentDate)}
      </Typography>
    </header>
  );
}

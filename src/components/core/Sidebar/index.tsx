"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdDashboard } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { Typography } from "@/components/core";
import { getLocalStorage } from "@/utils/localStorage";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

import styles from "./Sidebar.module.css";

interface UserData {
  name: string;
}

export function Sidebar() {
  const pathname = usePathname();
  const [userData, setUserData] = useState<UserData | null>(null);
  const isDashboardActive = pathname === "/dashboard";
  const { logout } = useAuth();

  useEffect(() => {
    const storedUser = getLocalStorage("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  return (
    <aside className={styles.container}>
      <div className={styles.userGreeting}>
        <Typography variant="h1" size={3}>
          Financeiro
        </Typography>
      </div>

      <div className={styles.logoContainer}>
        <Image
          src="/ac.webp"
          alt="Logo"
          width={120}
          height={40}
          className={styles.logo}
        />
      </div>

      <div className={styles.userGreeting}>
        <Typography variant="body" size={1.4}>
          Olá, {userData?.name || "Usuário"}
        </Typography>
      </div>

      <nav className={styles.navigation}>
        <Link
          href="/dashboard"
          className={`${styles.navLink} ${isDashboardActive ? styles.active : ""}`}
        >
          <MdDashboard size={20} />
          <Typography variant="body" size={1.6}>
            Dashboard
          </Typography>
        </Link>
      </nav>

      <div className={styles.footer}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            <Image
              src="/ac.webp"
              alt="Avatar do usuário"
              width={32}
              height={32}
              className={styles.avatarImage}
            />
          </div>
          <div className={styles.userName}>
            <Typography variant="body" size={1.2}>
              {userData?.name || "Usuário"}
            </Typography>
          </div>
          <button className={styles.logoutButton} onClick={logout}>
            <IoLogOut size={20} />
          </button>
        </div>
      </div>
    </aside>
  );
}

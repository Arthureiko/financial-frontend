import { Metadata, Viewport } from "next";
import { Sidebar } from "@/components/core/Sidebar";
import styles from "./page.module.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard financeiro.",
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
    <div className={styles.containerLayout}>
      <Sidebar />
      <main className={styles.mainLayout}>
        <div className={styles.contentLayout}>{children}</div>
      </main>
    </div>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/auth";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Finance Wallet - Seu Portal Financeiro",
  description:
    "Gerencie suas finanças de forma simples e eficiente. Realize transferências, depósitos e acompanhe seus gastos em um só lugar.",
  keywords: [
    "finanças",
    "portal financeiro",
    "transferência",
    "depósito",
    "controle financeiro",
  ],
  authors: [{ name: "Starbem" }],
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#E81F76" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

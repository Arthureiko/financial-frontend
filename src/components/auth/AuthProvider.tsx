"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const isAuthPage =
      pathname &&
      (pathname.startsWith("/") ||
        pathname.startsWith("/register") ||
        pathname.startsWith("/login"));

    if (!isAuthenticated && !isAuthPage) {
      router.push("/");
    } else if (isAuthenticated && isAuthPage) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, loading, pathname, router]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return <>{children}</>;
}

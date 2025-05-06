import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLocalStorage, removeLocalStorage } from "@/utils/localStorage";

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = getLocalStorage("user");
        if (!storedUser) {
          logout();
          return;
        }
        const userObj = JSON.parse(storedUser);
        if (!userObj?.id) {
          logout();
          return;
        }

        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          removeLocalStorage("user");
          setUser(null);
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        removeLocalStorage("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      removeLocalStorage("user");
      setUser(null);
      router.push("/");
    }
  };

  return {
    user,
    loading,
    logout,
  };
}

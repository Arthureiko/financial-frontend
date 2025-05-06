import { User } from "@/types/user";
import { api } from "@/services/api";

const AUTH_COOKIE = "auth-token";

export const auth = {
  getCurrentUser: (): Omit<User, "password"> | null => {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem("current-user");
    return user ? JSON.parse(user) : null;
  },

  setCurrentUser: (user: Omit<User, "password"> | null): void => {
    if (typeof window === "undefined") return;
    if (user) {
      localStorage.setItem("current-user", JSON.stringify(user));
      document.cookie = `${AUTH_COOKIE}=true; path=/; max-age=86400`; // 24 horas
    } else {
      localStorage.removeItem("current-user");
      document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0`;
    }
  },

  register: async (
    email: string,
    password: string,
    name: string,
  ): Promise<User> => {
    try {
      const user = await api.register({ email, password, name });
      auth.setCurrentUser(user);
      return user;
    } catch (error) {
      console.error("Erro ao registrar:", error);
      throw error;
    }
  },

  login: async (
    email: string,
    password: string,
  ): Promise<Omit<User, "password">> => {
    try {
      const user = await api.login(email, password);
      auth.setCurrentUser(user);
      return user;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  },

  logout: (): void => {
    auth.setCurrentUser(null);
  },

  isAuthenticated: (): boolean => {
    return !!auth.getCurrentUser();
  },
};

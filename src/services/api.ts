import { Transaction } from "@/types/transaction";
import { Category } from "@/types/category";
import { User } from "@/types/user";

const API_URL = "/api";

export const api = {
  // Transações
  getTransactions: async (): Promise<Transaction[]> => {
    const response = await fetch(`${API_URL}/transactions`);
    if (!response.ok) throw new Error("Erro ao buscar transações");
    return response.json();
  },

  createTransaction: async (
    transaction: Omit<Transaction, "id">,
  ): Promise<Transaction> => {
    const response = await fetch(`${API_URL}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    });
    if (!response.ok) throw new Error("Erro ao criar transação");
    return response.json();
  },

  updateTransaction: async (
    id: string,
    transaction: Partial<Transaction>,
  ): Promise<Transaction> => {
    const response = await fetch(`${API_URL}/transactions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    });
    if (!response.ok) throw new Error("Erro ao atualizar transação");
    return response.json();
  },

  deleteTransaction: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/transactions/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao deletar transação");
  },

  // Categorias
  getCategories: async (): Promise<Category[]> => {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) throw new Error("Erro ao buscar categorias");
    return response.json();
  },

  createCategory: async (category: Omit<Category, "id">): Promise<Category> => {
    const response = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    });
    if (!response.ok) throw new Error("Erro ao criar categoria");
    return response.json();
  },

  updateCategory: async (
    id: string,
    category: Partial<Category>,
  ): Promise<Category> => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    });
    if (!response.ok) throw new Error("Erro ao atualizar categoria");
    return response.json();
  },

  deleteCategory: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao deletar categoria");
  },

  // Autenticação
  register: async (user: Omit<User, "id">): Promise<User> => {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error("Erro ao registrar usuário");
    return response.json();
  },

  login: async (
    email: string,
    password: string,
  ): Promise<Omit<User, "password">> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error("Email ou senha inválidos");
    return response.json();
  },
};

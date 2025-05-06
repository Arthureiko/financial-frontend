import fs from "fs";
import path from "path";
import { User } from "@/types/user";
import { Transaction } from "@/types/transaction";
import { Category } from "@/types/category";

const DB_PATH = path.join(process.cwd(), "src/data/db.json");

export interface Database {
  users: User[];
  transactions: Transaction[];
  categories: Category[];
}

export const readDB = (): Database => {
  try {
    const data = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return { users: [], transactions: [], categories: [] };
  }
};

export const writeDB = (data: Database): void => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Erro ao escrever no banco de dados:", error);
    throw new Error("Erro ao salvar os dados");
  }
};

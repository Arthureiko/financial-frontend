import { NextApiRequest, NextApiResponse } from "next";
import { readDB, writeDB } from "../../../utils/db";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = readDB();
  const userId = req.headers["user-id"] as string;

  if (!userId) {
    return res.status(401).json({ message: "Usuário não autenticado" });
  }

  switch (req.method) {
    case "GET":
      // Filtra as transações do usuário atual
      const userTransactions = db.transactions.filter((t) => {
        if (t.type === "income" && t.category === "deposit") {
          return t.userId === userId;
        }
        if (t.type === "expense" && t.category === "transfer") {
          const targetUserId = t.description.split(" - ")[1];
          return t.userId === userId || targetUserId === userId;
        }
        return false;
      });
      return res.status(200).json(userTransactions);

    case "POST":
      const newTransaction = {
        id: Date.now().toString(),
        ...req.body,
        userId,
        createdAt: new Date().toISOString(),
      };

      db.transactions.push(newTransaction);
      writeDB(db);

      return res.status(201).json(newTransaction);

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

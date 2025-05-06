import { NextApiRequest, NextApiResponse } from "next";
import { readDB, writeDB } from "../../../utils/db";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = readDB();

  switch (req.method) {
    case "GET":
      return res.status(200).json(db.transactions);

    case "POST":
      const newTransaction = {
        id: Date.now().toString(),
        ...req.body,
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

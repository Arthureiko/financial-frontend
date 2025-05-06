import { NextApiRequest, NextApiResponse } from "next";
import { readDB, writeDB } from "../../../utils/db";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const db = readDB();
  const transactionIndex = db.transactions.findIndex((t) => t.id === id);

  if (transactionIndex === -1) {
    return res.status(404).json({ message: "Transação não encontrada" });
  }

  switch (req.method) {
    case "PUT":
      const updatedTransaction = {
        ...db.transactions[transactionIndex],
        ...req.body,
        updatedAt: new Date().toISOString(),
      };

      db.transactions[transactionIndex] = updatedTransaction;
      writeDB(db);

      return res.status(200).json(updatedTransaction);

    case "DELETE":
      db.transactions.splice(transactionIndex, 1);
      writeDB(db);

      return res.status(204).end();

    default:
      res.setHeader("Allow", ["PUT", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

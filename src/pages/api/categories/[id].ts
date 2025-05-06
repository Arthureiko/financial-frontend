import { NextApiRequest, NextApiResponse } from "next";
import { readDB, writeDB } from "../../../utils/db";
import { Category } from "@/types/category";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const db = readDB();
  const categoryIndex = db.categories.findIndex((c) => c.id === id);

  if (categoryIndex === -1) {
    return res.status(404).json({ message: "Categoria não encontrada" });
  }

  switch (req.method) {
    case "PUT":
      const updatedCategory: Category = {
        ...db.categories[categoryIndex],
        ...req.body,
        updatedAt: new Date().toISOString(),
      };

      db.categories[categoryIndex] = updatedCategory;
      writeDB(db);

      return res.status(200).json(updatedCategory);

    case "DELETE":
      db.categories.splice(categoryIndex, 1);
      writeDB(db);

      return res.status(204).end();

    default:
      res.setHeader("Allow", ["PUT", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

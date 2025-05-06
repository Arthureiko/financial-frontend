import { NextApiRequest, NextApiResponse } from "next";
import { readDB, writeDB } from "../../../utils/db";
import { Category } from "@/types/category";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = readDB();

  switch (req.method) {
    case "GET":
      return res.status(200).json(db.categories);

    case "POST":
      const newCategory: Category = {
        id: Date.now().toString(),
        ...req.body,
        createdAt: new Date().toISOString(),
      };

      db.categories.push(newCategory);
      writeDB(db);

      return res.status(201).json(newCategory);

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

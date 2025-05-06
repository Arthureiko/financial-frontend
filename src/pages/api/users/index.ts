import { NextApiRequest, NextApiResponse } from "next";
import { readDB, writeDB } from "../../../utils/db";
import { User } from "../../../types/user";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = readDB();

  switch (req.method) {
    case "GET":
      return res.status(200).json(db.users || []);

    case "POST":
      const { email, password, name } = req.body;

      if (db.users?.some((user) => user.email === email)) {
        return res.status(400).json({ message: "Email já cadastrado" });
      }

      const newUser: User = {
        id: crypto.randomUUID(),
        email,
        password,
        name,
        createdAt: new Date().toISOString(),
      };

      if (!db.users) db.users = [];
      db.users.push(newUser);
      writeDB(db);

      return res.status(201).json(newUser);

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

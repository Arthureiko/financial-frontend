import { NextApiRequest, NextApiResponse } from "next";
import { readDB } from "../../../utils/db";
import { User } from "@/types/user";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { email, password } = req.body;
  const db = readDB();

  const user = db.users.find(
    (u: User) => u.email === email && u.password === password,
  );

  if (!user) {
    return res.status(401).json({ message: "Email ou senha inválidos" });
  }

  // Remove a senha do objeto antes de enviar
  const { password: _, ...userWithoutPassword } = user;

  return res.status(200).json(userWithoutPassword);
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = request.cookies.get("user");

    if (!user) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const userData = JSON.parse(user.value);

    const userBalance = await prisma.user.findUnique({
      where: { id: userData.id },
      select: { balance: true },
    });

    if (!userBalance) {
      return NextResponse.json(
        { message: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ balance: userBalance.balance });
  } catch (error) {
    console.error("Erro ao buscar saldo:", error);
    return NextResponse.json(
      { message: "Erro ao buscar saldo" },
      { status: 500 }
    );
  }
}

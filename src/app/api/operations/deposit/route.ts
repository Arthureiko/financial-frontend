import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const user = request.cookies.get("user");

    if (!user) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const userData = JSON.parse(user.value);
    const { amount } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ message: "Valor inválido" }, { status: 400 });
    }

    // Busca o saldo atual do usuário
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

    // Calcula o novo saldo
    const newBalance = userBalance.balance + amount;

    // Atualiza o saldo do usuário
    await prisma.user.update({
      where: { id: userData.id },
      data: { balance: newBalance },
    });

    // Registra a operação
    await prisma.operation.create({
      data: {
        type: "deposit",
        amount,
        userId: userData.id,
        status: "completed",
      },
    });

    return NextResponse.json(
      { message: "Depósito realizado com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao realizar depósito:", error);
    return NextResponse.json(
      { message: "Erro ao realizar depósito" },
      { status: 500 }
    );
  }
}

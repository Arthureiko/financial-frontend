import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const { amount, targetUserId } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ message: "Valor inválido" }, { status: 400 });
    }

    if (!targetUserId) {
      return NextResponse.json(
        { message: "Usuário destinatário não informado" },
        { status: 400 }
      );
    }

    // Busca o saldo do usuário remetente
    const sender = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { balance: true },
    });

    if (!sender) {
      return NextResponse.json(
        { message: "Usuário remetente não encontrado" },
        { status: 404 }
      );
    }

    // Verifica se o usuário tem saldo suficiente
    if (sender.balance < amount) {
      return NextResponse.json(
        { message: "Saldo insuficiente" },
        { status: 400 }
      );
    }

    // Busca o usuário destinatário
    const receiver = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { balance: true },
    });

    if (!receiver) {
      return NextResponse.json(
        { message: "Usuário destinatário não encontrado" },
        { status: 404 }
      );
    }

    // Realiza a transferência em uma transação
    await prisma.$transaction([
      // Atualiza o saldo do remetente
      prisma.user.update({
        where: { id: session.user.id },
        data: { balance: sender.balance - amount },
      }),
      // Atualiza o saldo do destinatário
      prisma.user.update({
        where: { id: targetUserId },
        data: { balance: receiver.balance + amount },
      }),
      // Registra a operação
      prisma.operation.create({
        data: {
          type: "transfer",
          amount,
          userId: session.user.id,
          targetUserId,
          status: "completed",
        },
      }),
    ]);

    return NextResponse.json(
      { message: "Transferência realizada com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao realizar transferência:", error);
    return NextResponse.json(
      { message: "Erro ao realizar transferência" },
      { status: 500 }
    );
  }
}

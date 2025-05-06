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
    const { operationId } = await request.json();

    if (!operationId) {
      return NextResponse.json(
        { message: "ID da operação não informado" },
        { status: 400 }
      );
    }

    // Busca a operação
    const operation = await prisma.operation.findUnique({
      where: { id: operationId },
    });

    if (!operation) {
      return NextResponse.json(
        { message: "Operação não encontrada" },
        { status: 404 }
      );
    }

    // Verifica se a operação pertence ao usuário
    if (operation.userId !== userData.id) {
      return NextResponse.json(
        { message: "Operação não pertence ao usuário" },
        { status: 403 }
      );
    }

    // Verifica se a operação já foi revertida
    if (operation.status === "reversed") {
      return NextResponse.json(
        { message: "Operação já foi revertida" },
        { status: 400 }
      );
    }

    // Realiza a reversão em uma transação
    await prisma.$transaction(async (tx) => {
      // Atualiza o saldo do usuário
      if (operation.type === "deposit") {
        await tx.user.update({
          where: { id: userData.id },
          data: {
            balance: {
              decrement: operation.amount,
            },
          },
        });
      } else if (operation.type === "transfer") {
        // Busca os usuários envolvidos
        const sender = await tx.user.findUnique({
          where: { id: operation.userId },
        });
        const receiver = await tx.user.findUnique({
          where: { id: operation.targetUserId! },
        });

        if (!sender || !receiver) {
          throw new Error("Usuários não encontrados");
        }

        // Reverte a transferência
        await tx.user.update({
          where: { id: operation.userId },
          data: {
            balance: {
              increment: operation.amount,
            },
          },
        });

        await tx.user.update({
          where: { id: operation.targetUserId! },
          data: {
            balance: {
              decrement: operation.amount,
            },
          },
        });
      }

      // Atualiza o status da operação
      await tx.operation.update({
        where: { id: operationId },
        data: {
          status: "reversed",
          reversedAt: new Date(),
        },
      });
    });

    return NextResponse.json(
      { message: "Operação revertida com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao reverter operação:", error);
    return NextResponse.json(
      { message: "Erro ao reverter operação" },
      { status: 500 }
    );
  }
}

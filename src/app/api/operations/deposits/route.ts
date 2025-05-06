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

    const deposits = await prisma.operation.findMany({
      where: {
        userId: userData.id,
        type: "deposit",
        status: "completed",
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        amount: true,
        createdAt: true,
      },
    });

    return NextResponse.json(deposits);
  } catch (error) {
    console.error("Erro ao buscar depósitos:", error);
    return NextResponse.json(
      { message: "Erro ao buscar depósitos" },
      { status: 500 }
    );
  }
}

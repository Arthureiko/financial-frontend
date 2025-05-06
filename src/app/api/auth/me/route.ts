import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const user = request.cookies.get("user");

  if (!user) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  return NextResponse.json(
    {
      user: JSON.parse(user.value),
    },
    { status: 200 }
  );
}

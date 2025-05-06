import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");

  // Verifica se existe o cookie de autenticação
  const authCookie = request.cookies.get("auth-token");
  const isAuthenticated = !!authCookie;

  if (!isAuthenticated && !isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};

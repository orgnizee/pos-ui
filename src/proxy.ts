import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/entrar"];

export function proxy(req: NextRequest) {
  const token = req.cookies.get("access")?.value;
  const isPublic = PUBLIC_ROUTES.includes(req.nextUrl.pathname);

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/entrar", req.url));
  }

  if (token && isPublic) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

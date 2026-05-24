import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const session = req.cookies.get("admin_session");
    const validSecret = process.env.NEXTAUTH_SECRET;

    if (!session || session.value !== validSecret) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  if (pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/auth")) {
    const session = req.cookies.get("admin_session");
    const validSecret = process.env.NEXTAUTH_SECRET;

    if (!session || session.value !== validSecret) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { validateAdminCredentials, hashPassword } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "missing" }, { status: 400 });
    }

    // Auto-create admin on first login
    const adminCount = await prisma.admin.count();
    if (adminCount === 0) {
      const defaultUser = process.env.ADMIN_USERNAME || "admin";
      const defaultPass = process.env.ADMIN_PASSWORD || "admin2024!";
      await prisma.admin.create({
        data: {
          username: defaultUser,
          password: await hashPassword(defaultPass),
        },
      });
    }

    const valid = await validateAdminCredentials(username, password);
    if (!valid) {
      return NextResponse.json({ error: "invalid" }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set("admin_session", process.env.NEXTAUTH_SECRET || "secret", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return NextResponse.json({ success: true });
}

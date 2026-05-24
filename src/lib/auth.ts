import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function validateAdminCredentials(username: string, password: string): Promise<boolean> {
  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin) return false;
  return verifyPassword(password, admin.password);
}

export async function getAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === process.env.NEXTAUTH_SECRET;
}

export async function createAdminSession(): Promise<string> {
  return process.env.NEXTAUTH_SECRET || "secret";
}

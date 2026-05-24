import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

export const TOTAL_REQUIRED = 25000;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";
  const libsqlUrl = dbUrl.startsWith("file:.")
    ? `file:${process.cwd()}/${dbUrl.slice(5)}`
    : dbUrl;

  const adapter = new PrismaLibSql({ url: libsqlUrl });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error"] : [],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";
import path from "path";

const dbPath = path.resolve(__dirname, "../prisma/dev.db");
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin2024!";

  const existing = await prisma.admin.findUnique({ where: { username } });
  if (existing) {
    console.log(`✓ Admin "${username}" existe déjà.`);
    return;
  }

  const hashed = await bcrypt.hash(password, 12);
  await prisma.admin.create({ data: { username, password: hashed } });
  console.log(`✓ Admin "${username}" créé avec succès.`);
  console.log(`  Identifiant : ${username}`);
  console.log(`  Mot de passe : ${password}`);
  console.log(`  ⚠  Changez le mot de passe en production (variable ADMIN_PASSWORD dans .env)`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

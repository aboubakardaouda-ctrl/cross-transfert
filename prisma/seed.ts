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
  if (!existing) {
    const hashed = await bcrypt.hash(password, 12);
    await prisma.admin.create({ data: { username, password: hashed } });
    console.log(`✓ Admin "${username}" créé avec succès.`);
    console.log(`  Identifiant : ${username}`);
    console.log(`  Mot de passe : ${password}`);
    console.log(`  ⚠  Changez le mot de passe en production (variable ADMIN_PASSWORD dans .env)`);
  } else {
    console.log(`✓ Admin "${username}" existe déjà.`);
  }

  await prisma.eventSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      title: "2ème Assemblée Générale de l'ACTILC",
      titleEn: "2nd General Assembly of ACTILC",
      titleZh: "ACTILC第二届全体大会",
      eventDate: "Dimanche 27 décembre 2026 — 9h00 précise",
      eventLocation: "Franco Hôtel, Yaoundé",
      totalRequired: 25000,
      year: 2026,
    },
    update: {},
  });
  console.log("✓ Paramètres de l'événement initialisés.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

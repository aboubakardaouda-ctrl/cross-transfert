import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEFAULT: Parameters<typeof prisma.eventSettings.upsert>[0]["create"] = {
  id: "default",
  title: "2ème Assemblée Générale de l'ACTILC",
  titleEn: "2nd General Assembly of ACTILC",
  titleZh: "ACTILC第二届全体大会",
  eventDate: "Dimanche 27 décembre 2026 — 9h00 précise",
  eventLocation: "Franco Hôtel, Yaoundé",
  totalRequired: 25000,
  year: 2026,
};

export async function GET() {
  const settings = await prisma.eventSettings.upsert({
    where: { id: "default" },
    create: DEFAULT,
    update: {},
  });
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();

  const settings = await prisma.eventSettings.upsert({
    where: { id: "default" },
    create: { ...DEFAULT, ...body },
    update: {
      title: body.title,
      titleEn: body.titleEn,
      titleZh: body.titleZh,
      eventDate: body.eventDate,
      eventLocation: body.eventLocation,
      totalRequired: Number(body.totalRequired) || 25000,
      year: Number(body.year) || new Date().getFullYear(),
    },
  });

  return NextResponse.json(settings);
}

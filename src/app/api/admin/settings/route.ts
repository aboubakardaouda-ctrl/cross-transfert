import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEFAULT: Parameters<typeof prisma.eventSettings.upsert>[0]["create"] = {
  id: "default",
  title: "Conférence Annuelle des Traducteurs Chinois",
  titleEn: "Annual Chinese Translators' Conference",
  titleZh: "中文译者年会",
  eventDate: "À confirmer",
  eventLocation: "À confirmer",
  totalRequired: 25000,
  year: new Date().getFullYear(),
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

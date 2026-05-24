import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendAdminNotification } from "@/lib/email";
import { checkRateLimit } from "@/lib/ratelimit";
import { z } from "zod";

const rsvpSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(6).max(30),
  translatorId: z.string().min(2).max(50),
  city: z.string().min(2).max(100),
  participates: z.boolean(),
  comment: z.string().max(500).optional(),
  language: z.enum(["fr", "en", "zh"]).default("fr"),
});

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const { allowed } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "rate_limited", message: "Trop de tentatives. Réessayez dans 1 heure." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const data = rsvpSchema.parse(body);

    const existing = await prisma.participant.findFirst({
      where: {
        OR: [{ email: data.email }, { translatorId: data.translatorId }],
      },
    });

    if (existing) {
      return NextResponse.json({ error: "duplicate" }, { status: 409 });
    }

    const participant = await prisma.participant.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        translatorId: data.translatorId,
        city: data.city,
        participates: data.participates,
        comment: data.comment || null,
        language: data.language,
        status: "pending",
      },
    });

    await prisma.historyLog.create({
      data: {
        participantId: participant.id,
        action: "rsvp_submitted",
        details: `RSVP soumis depuis ${data.city}`,
      },
    });

    sendAdminNotification(participant).catch(console.error);

    return NextResponse.json({ success: true, id: participant.id }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "validation", details: err.issues }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const translatorId = searchParams.get("translatorId");

  if (!email && !translatorId) {
    return NextResponse.json({ error: "missing params" }, { status: 400 });
  }

  const participant = await prisma.participant.findFirst({
    where: email ? { email } : { translatorId: translatorId! },
    include: { payments: { orderBy: { createdAt: "asc" } } },
  });

  if (!participant) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const totalPaid = participant.payments.reduce((s, p) => s + p.amount, 0);

  return NextResponse.json({
    id: participant.id,
    fullName: participant.fullName,
    status: participant.status,
    invitationSent: participant.invitationSent,
    totalPaid,
    remaining: Math.max(0, 25000 - totalPaid),
  });
}

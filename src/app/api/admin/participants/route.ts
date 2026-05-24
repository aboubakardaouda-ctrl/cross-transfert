import { NextRequest, NextResponse } from "next/server";
import { prisma, TOTAL_REQUIRED } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const isAdmin = await getAdminSession();
  if (!isAdmin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("q") || "";
  const status = searchParams.get("status") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { fullName: { contains: search } },
      { email: { contains: search } },
      { phone: { contains: search } },
      { translatorId: { contains: search } },
    ];
  }
  if (status) {
    where.status = status;
  }

  const [participants, total] = await Promise.all([
    prisma.participant.findMany({
      where,
      include: { payments: { orderBy: { createdAt: "asc" } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.participant.count({ where }),
  ]);

  const stats = await prisma.participant.groupBy({
    by: ["status"],
    _count: true,
  });

  const invitedCount = await prisma.participant.count({ where: { invitationSent: true } });

  const enriched = participants.map((p) => {
    const totalPaid = p.payments.reduce((s, pay) => s + pay.amount, 0);
    return {
      ...p,
      totalPaid,
      remaining: Math.max(0, TOTAL_REQUIRED - totalPaid),
    };
  });

  return NextResponse.json({
    participants: enriched,
    total,
    stats: {
      total,
      pending: stats.find((s) => s.status === "pending")?._count || 0,
      validated: stats.find((s) => s.status === "validated")?._count || 0,
      invited: invitedCount,
    },
  });
}

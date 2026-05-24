import { NextRequest, NextResponse } from "next/server";
import { prisma, TOTAL_REQUIRED } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const isAdmin = await getAdminSession();
  if (!isAdmin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const participant = await prisma.participant.findUnique({
    where: { id },
    include: {
      payments: { orderBy: { createdAt: "asc" } },
      history: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!participant) return NextResponse.json({ error: "not found" }, { status: 404 });

  const totalPaid = participant.payments.reduce((s, p) => s + p.amount, 0);

  return NextResponse.json({
    ...participant,
    totalPaid,
    remaining: Math.max(0, TOTAL_REQUIRED - totalPaid),
  });
}

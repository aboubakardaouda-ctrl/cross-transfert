import { NextRequest, NextResponse } from "next/server";
import { prisma, TOTAL_REQUIRED } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { z } from "zod";

const paymentSchema = z.object({
  participantId: z.string(),
  amount: z.number().positive().max(TOTAL_REQUIRED),
  note: z.string().max(200).optional(),
});

export async function POST(req: NextRequest) {
  const isAdmin = await getAdminSession();
  if (!isAdmin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = paymentSchema.parse(body);

    const participant = await prisma.participant.findUnique({
      where: { id: data.participantId },
      include: { payments: true },
    });

    if (!participant) return NextResponse.json({ error: "not found" }, { status: 404 });

    const payment = await prisma.payment.create({
      data: {
        participantId: data.participantId,
        amount: data.amount,
        note: data.note || null,
      },
    });

    const newTotal = participant.payments.reduce((s, p) => s + p.amount, 0) + data.amount;

    await prisma.historyLog.create({
      data: {
        participantId: data.participantId,
        action: "payment_added",
        details: `Versement de ${data.amount.toLocaleString("fr-FR")} FCFA${data.note ? ` — ${data.note}` : ""}. Total: ${newTotal.toLocaleString("fr-FR")} / ${TOTAL_REQUIRED.toLocaleString("fr-FR")} FCFA`,
      },
    });

    if (newTotal >= TOTAL_REQUIRED && participant.status === "pending") {
      await prisma.participant.update({
        where: { id: data.participantId },
        data: { status: "validated" },
      });

      await prisma.historyLog.create({
        data: {
          participantId: data.participantId,
          action: "status_changed",
          details: `Statut mis à jour: validé (contribution complète: ${newTotal.toLocaleString("fr-FR")} FCFA)`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      payment,
      totalPaid: newTotal,
      remaining: Math.max(0, TOTAL_REQUIRED - newTotal),
      newStatus: newTotal >= TOTAL_REQUIRED ? "validated" : "pending",
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "validation", details: err.issues }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

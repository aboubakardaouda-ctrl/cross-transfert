import { NextRequest, NextResponse } from "next/server";
import { prisma, TOTAL_REQUIRED } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { generateInvitationPDF } from "@/lib/pdf";
import { sendInvitationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const isAdmin = await getAdminSession();
  if (!isAdmin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const { participantId } = await req.json();

    const [participant, settings] = await Promise.all([
      prisma.participant.findUnique({
        where: { id: participantId },
        include: { payments: true },
      }),
      prisma.eventSettings.findUnique({ where: { id: "default" } }),
    ]);

    if (!participant) return NextResponse.json({ error: "not found" }, { status: 404 });

    const totalPaid = participant.payments.reduce((s, p) => s + p.amount, 0);
    if (totalPaid < TOTAL_REQUIRED) {
      return NextResponse.json({ error: "contribution_incomplete" }, { status: 400 });
    }

    const year = settings?.year || new Date().getFullYear();
    const invNum = `INV-${participant.translatorId.toUpperCase()}-${year}`;

    const pdfBuffer = await generateInvitationPDF({
      fullName: participant.fullName,
      translatorId: participant.translatorId,
      eventTitle: settings?.title || "Conférence Annuelle des Traducteurs Chinois",
      eventDate: settings?.eventDate || "À confirmer",
      eventLocation: settings?.eventLocation || "À confirmer",
      invitationNumber: invNum,
    });

    const sent = await sendInvitationEmail(participant, pdfBuffer);

    if (sent) {
      await prisma.participant.update({
        where: { id: participantId },
        data: { status: "invited", invitationSent: true, invitationSentAt: new Date() },
      });
      await prisma.historyLog.create({
        data: {
          participantId,
          action: "invitation_sent",
          details: `Invitation PDF envoyée à ${participant.email} (${invNum})`,
        },
      });
      return NextResponse.json({ success: true, invitationNumber: invNum });
    } else {
      return NextResponse.json({ error: "email_failed" }, { status: 500 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

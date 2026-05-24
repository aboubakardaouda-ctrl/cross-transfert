import { NextRequest, NextResponse } from "next/server";
import { prisma, TOTAL_REQUIRED } from "@/lib/db";
import { generateInvitationPDF } from "@/lib/pdf";
import { sendInvitationEmail } from "@/lib/email";

export async function POST(_req: NextRequest) {
  // Find all validated participants who haven't received their invitation yet
  const candidates = await prisma.participant.findMany({
    where: { status: "validated", invitationSent: false },
    include: { payments: true },
  });

  const eligible = candidates.filter(
    (p) => p.payments.reduce((s, pay) => s + pay.amount, 0) >= TOTAL_REQUIRED
  );

  if (eligible.length === 0) {
    return NextResponse.json({ success: true, sent: 0, message: "Aucun participant éligible." });
  }

  // Retrieve event settings
  const settings = await prisma.eventSettings.findUnique({ where: { id: "default" } });
  const eventTitle = settings?.title || "Conférence Annuelle des Traducteurs Chinois";
  const eventDate = settings?.eventDate || "À confirmer";
  const eventLocation = settings?.eventLocation || "À confirmer";
  const year = settings?.year || new Date().getFullYear();

  let sent = 0;
  const errors: string[] = [];

  for (const participant of eligible) {
    try {
      const invNum = `INV-${participant.translatorId.toUpperCase()}-${year}`;

      const pdfBuffer = await generateInvitationPDF({
        fullName: participant.fullName,
        translatorId: participant.translatorId,
        eventTitle,
        eventDate,
        eventLocation,
        invitationNumber: invNum,
      });

      const ok = await sendInvitationEmail(participant, pdfBuffer);

      if (ok) {
        await prisma.participant.update({
          where: { id: participant.id },
          data: { status: "invited", invitationSent: true, invitationSentAt: new Date() },
        });
        await prisma.historyLog.create({
          data: {
            participantId: participant.id,
            action: "invitation_sent",
            details: `Invitation envoyée en lot à ${participant.email} (${invNum})`,
          },
        });
        sent++;
      } else {
        errors.push(participant.email);
      }
    } catch (err) {
      errors.push(`${participant.email}: ${err}`);
    }
  }

  return NextResponse.json({
    success: true,
    sent,
    total: eligible.length,
    errors: errors.length > 0 ? errors : undefined,
  });
}

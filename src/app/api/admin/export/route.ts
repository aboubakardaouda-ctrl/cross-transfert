import { NextRequest, NextResponse } from "next/server";
import { prisma, TOTAL_REQUIRED } from "@/lib/db";

export async function GET(req: NextRequest) {
  const participants = await prisma.participant.findMany({
    include: { payments: true },
    orderBy: { createdAt: "desc" },
  });

  const rows = [
    [
      "Nom complet",
      "E-mail",
      "Téléphone",
      "Matricule",
      "Ville",
      "Participe",
      "Statut",
      "Total versé (FCFA)",
      "Reste à verser (FCFA)",
      "Invitation envoyée",
      "Date inscription",
      "Commentaire",
    ].join(";"),
    ...participants.map((p) => {
      const totalPaid = p.payments.reduce((s, pay) => s + pay.amount, 0);
      const remaining = Math.max(0, TOTAL_REQUIRED - totalPaid);
      const statusLabel =
        p.status === "invited"
          ? "Invitation envoyée"
          : p.status === "validated"
          ? "Validé"
          : "En attente";

      return [
        `"${p.fullName}"`,
        `"${p.email}"`,
        `"${p.phone}"`,
        `"${p.translatorId}"`,
        `"${p.city}"`,
        p.participates ? "Oui" : "Non",
        statusLabel,
        totalPaid,
        remaining,
        p.invitationSent ? "Oui" : "Non",
        new Date(p.createdAt).toLocaleDateString("fr-FR"),
        `"${(p.comment || "").replace(/"/g, "'")}"`,
      ].join(";");
    }),
  ].join("\n");

  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse("﻿" + rows, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="participants-${date}.csv"`,
    },
  });
}

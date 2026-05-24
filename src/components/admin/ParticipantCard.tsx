"use client";

import Link from "next/link";

interface Participant {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  translatorId: string;
  city: string;
  status: string;
  totalPaid: number;
  remaining: number;
  invitationSent: boolean;
  participates: boolean;
  createdAt: string;
}

const TOTAL = 25000;

export default function ParticipantCard({ p }: { p: Participant }) {
  const pct = Math.min(100, Math.round((p.totalPaid / TOTAL) * 100));

  const statusConfig = {
    pending: { label: "En attente", bg: "status-pending", dot: "#D4A000" },
    validated: { label: "Validé", bg: "status-validated", dot: "#155724" },
    invited: { label: "Invitation envoyée", bg: "status-invited", dot: "#0A4A8A" },
  };
  const sc = statusConfig[p.status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <Link
      href={`/admin/participants/${p.id}`}
      className="block bg-white border border-[#F0E8D0] rounded-lg p-4 transition-all duration-200 hover:border-[#C9A96E] hover:shadow-md active:scale-[0.99]"
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 pr-3">
          <p className="font-medium text-[#1A1A1A] text-sm leading-snug truncate">{p.fullName}</p>
          <p className="text-xs text-[#888] mt-0.5 font-mono">{p.translatorId}</p>
        </div>
        <span className={`${sc.bg} text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 flex items-center gap-1.5`}>
          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: sc.dot }} />
          {sc.label}
        </span>
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-[#888] font-light">Contribution</span>
          <span className="font-medium text-[#1A1A1A]">{p.totalPaid.toLocaleString("fr-FR")} / {TOTAL.toLocaleString("fr-FR")} FCFA</span>
        </div>
        <div className="progress-track h-1.5 w-full">
          <div className="progress-fill h-full" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between text-[10px] mt-1 text-[#AAA]">
          <span>{pct}% versé</span>
          {p.remaining > 0 && <span>Reste : {p.remaining.toLocaleString("fr-FR")} FCFA</span>}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[11px] text-[#AAA]">
        <span>{p.city}</span>
        <span>{new Date(p.createdAt).toLocaleDateString("fr-FR")}</span>
      </div>
    </Link>
  );
}

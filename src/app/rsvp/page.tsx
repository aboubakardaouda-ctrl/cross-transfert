"use client";

import { useState } from "react";
import Link from "next/link";
import { Ornament } from "@/components/ui/Ornament";

interface StatusResult {
  fullName: string;
  status: string;
  totalPaid: number;
  remaining: number;
  invitationSent: boolean;
}

const TOTAL = 25000;

const statusConfig = {
  pending: {
    label: "En attente de validation",
    labelEn: "Pending validation",
    labelZh: "等待审核",
    color: "#92650A",
    bg: "#FEF3CD",
    border: "#F0D070",
    dot: "#D4A000",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="11" stroke="#D4A000" strokeWidth="1.5" />
        <path d="M14 8v7l4 3" stroke="#D4A000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  validated: {
    label: "Contribution validée",
    labelEn: "Contribution validated",
    labelZh: "缴费已确认",
    color: "#155724",
    bg: "#D4EDDA",
    border: "#A8D5B5",
    dot: "#28A745",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="11" stroke="#28A745" strokeWidth="1.5" />
        <path d="M9 14l3.5 3.5 6.5-7" stroke="#28A745" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  invited: {
    label: "Invitation envoyée",
    labelEn: "Invitation sent",
    labelZh: "邀请函已发送",
    color: "#0A4A8A",
    bg: "#D1E7FF",
    border: "#90C4F0",
    dot: "#0D6EFD",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="11" stroke="#0D6EFD" strokeWidth="1.5" />
        <path d="M8 14l4-4 8 8M16 10l2 2" stroke="#0D6EFD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="7" y="12" width="14" height="9" rx="1" stroke="#0D6EFD" strokeWidth="1.3" />
        <path d="M7 13l7 5 7-5" stroke="#0D6EFD" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
};

export default function RSVPStatusPage() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StatusResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;

    setLoading(true);
    setResult(null);
    setNotFound(false);
    setSearched(false);

    try {
      const isEmail = search.includes("@");
      const params = isEmail
        ? `email=${encodeURIComponent(search.trim())}`
        : `translatorId=${encodeURIComponent(search.trim())}`;

      const res = await fetch(`/api/rsvp?${params}`);
      if (res.status === 404) {
        setNotFound(true);
      } else if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const pct = result ? Math.min(100, Math.round((result.totalPaid / TOTAL) * 100)) : 0;
  const sc = result ? (statusConfig[result.status as keyof typeof statusConfig] || statusConfig.pending) : null;

  return (
    <div
      className="min-h-screen flex flex-col pattern-bg"
      style={{ background: "linear-gradient(180deg, #FDFCF8 0%, #F5F0E8 100%)" }}
    >
      {/* Header */}
      <div className="border-b border-[#F0E8D0] bg-white/80 backdrop-blur-sm px-5 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#8B1A1A] rounded-sm flex items-center justify-center">
              <span className="text-white text-xs" style={{ fontFamily: "serif" }}>中</span>
            </div>
            <span className="text-sm font-light text-[#1A1A1A] tracking-wide" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
              中文译者年会
            </span>
          </Link>
          <Link href="/#rsvp" className="text-xs text-[#8B1A1A] hover:underline tracking-wide">
            ← Retour
          </Link>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start px-6 pt-12 pb-16 max-w-md mx-auto w-full">
        {/* Title */}
        <div className="text-center mb-10 w-full">
          <span className="text-[10px] tracking-[0.3em] text-[#C9A96E] uppercase font-light block mb-3">
            查询回执状态
          </span>
          <h1
            className="text-2xl font-light tracking-wide text-[#1A1A1A] mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Suivi de mon RSVP
          </h1>
          <Ornament />
          <p className="mt-5 text-sm text-[#777] font-light leading-relaxed">
            Saisissez votre adresse e-mail ou votre matricule de traducteur pour consulter l'état de votre dossier.
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="w-full space-y-3 mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="E-mail ou matricule de traducteur"
            className="w-full px-4 py-4 border border-[#E8D5B0] rounded bg-white text-sm outline-none focus:border-[#8B1A1A] focus:ring-1 focus:ring-[#8B1A1A] focus:ring-opacity-20 transition-all font-light"
            inputMode="email"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={loading || !search.trim()}
            className="w-full py-4 bg-[#8B1A1A] text-white text-sm tracking-widest uppercase transition-all duration-200 rounded hover:bg-[#6B1313] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Recherche...
              </>
            ) : (
              "Consulter mon statut"
            )}
          </button>
        </form>

        {/* Not found */}
        {searched && notFound && (
          <div className="w-full p-5 bg-white border border-[#F0E8D0] rounded-lg text-center">
            <div className="text-3xl mb-3 opacity-20" style={{ fontFamily: "serif" }}>中</div>
            <p className="text-sm text-[#888] font-light mb-1">Aucun dossier trouvé</p>
            <p className="text-xs text-[#BBB] leading-relaxed">
              Vérifiez votre e-mail ou matricule, ou{" "}
              <Link href="/#rsvp" className="text-[#8B1A1A] hover:underline">
                soumettez votre RSVP
              </Link>{" "}
              si ce n'est pas encore fait.
            </p>
          </div>
        )}

        {/* Result */}
        {result && sc && (
          <div className="w-full space-y-4 animate-fade-in">
            {/* Name & status */}
            <div className="bg-white border border-[#F0E8D0] rounded-lg p-5" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
              <div className="flex items-start gap-4 mb-5">
                <div className="flex-shrink-0">{sc.icon}</div>
                <div>
                  <p className="font-medium text-[#1A1A1A] leading-snug">{result.fullName}</p>
                  <div
                    className="inline-flex items-center gap-1.5 mt-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                    style={{ background: sc.bg, borderColor: sc.border, color: sc.color }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sc.dot }} />
                    {sc.label}
                  </div>
                  <p className="text-xs text-[#AAA] mt-1 font-light">{sc.labelZh}</p>
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-[#888] font-light">Contribution</span>
                  <span className="font-semibold text-[#1A1A1A]">
                    {result.totalPaid.toLocaleString("fr-FR")} / {TOTAL.toLocaleString("fr-FR")} FCFA
                  </span>
                </div>
                <div className="h-2.5 bg-[#F0E8D0] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${pct}%`,
                      background: "linear-gradient(90deg, #8B1A1A, #A52020)",
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] mt-1.5 text-[#AAA]">
                  <span>{pct}% versé</span>
                  {result.remaining > 0 && (
                    <span>Reste : {result.remaining.toLocaleString("fr-FR")} FCFA</span>
                  )}
                </div>
              </div>
            </div>

            {/* Status explanation */}
            <div
              className="p-4 rounded border text-sm font-light leading-relaxed"
              style={{ background: sc.bg, borderColor: sc.border, color: sc.color }}
            >
              {result.status === "pending" && (
                <p>
                  Votre dossier est en cours de traitement. L'administrateur enregistre vos versements progressivement. Votre invitation officielle sera envoyée dès que votre contribution de <strong>25 000 FCFA</strong> sera complète.
                </p>
              )}
              {result.status === "validated" && (
                <p>
                  Votre contribution est complète. Votre dossier est validé. L'administrateur va procéder à l'envoi de votre invitation officielle par e-mail très prochainement.
                </p>
              )}
              {result.status === "invited" && (
                <p>
                  Félicitations ! Votre invitation officielle nominative a été envoyée à votre adresse e-mail. Veuillez vérifier votre boîte de réception (et vos courriers indésirables).
                </p>
              )}
            </div>

            {result.status === "pending" && (
              <p className="text-center text-xs text-[#BBB] leading-relaxed px-2">
                Si vous avez effectué un versement récemment, patientez le temps que l'administrateur l'enregistre dans le système.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[#F0E8D0] py-6 text-center">
        <p className="text-[11px] text-[#CCC] tracking-wider">billetdinvitation.site · 中文译者年会</p>
      </div>
    </div>
  );
}

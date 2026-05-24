"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";

interface Payment {
  id: string;
  amount: number;
  note: string | null;
  createdAt: string;
}

interface HistoryLog {
  id: string;
  action: string;
  details: string | null;
  createdAt: string;
}

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
  invitationSentAt: string | null;
  participates: boolean;
  comment: string | null;
  createdAt: string;
  payments: Payment[];
  history: HistoryLog[];
}

const TOTAL = 25000;

const actionLabels: Record<string, string> = {
  rsvp_submitted: "RSVP soumis",
  payment_added: "Versement ajouté",
  status_changed: "Statut modifié",
  invitation_sent: "Invitation envoyée",
};

export default function ParticipantDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [participant, setParticipant] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [addingPayment, setAddingPayment] = useState(false);
  const [sendingInvitation, setSendingInvitation] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const fetchParticipant = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/participants/${id}`);
      if (res.status === 401) { router.push("/admin/login"); return; }
      if (!res.ok) { router.push("/admin/dashboard"); return; }
      const data = await res.json();
      setParticipant(data);
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => { fetchParticipant(); }, [fetchParticipant]);

  const handleAddPayment = async () => {
    const amount = parseFloat(paymentAmount);
    if (!amount || amount <= 0) { setErrorMsg("Montant invalide"); return; }
    setAddingPayment(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: id, amount, note: paymentNote || undefined }),
      });
      if (!res.ok) {
        setErrorMsg("Erreur lors de l'ajout du paiement.");
      } else {
        setSuccessMsg("Versement ajouté avec succès.");
        setPaymentAmount("");
        setPaymentNote("");
        setShowPaymentForm(false);
        await fetchParticipant();
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } finally {
      setAddingPayment(false);
    }
  };

  const handleSendInvitation = async () => {
    if (!confirm("Envoyer l'invitation PDF officielle par e-mail ?")) return;
    setSendingInvitation(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/send-invitation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(
          data.error === "contribution_incomplete"
            ? "La contribution n'est pas encore complète (25 000 FCFA requis)."
            : "Erreur lors de l'envoi. Vérifiez la configuration e-mail."
        );
      } else {
        setSuccessMsg(`Invitation envoyée ! N° ${data.invitationNumber}`);
        await fetchParticipant();
        setTimeout(() => setSuccessMsg(""), 5000);
      }
    } finally {
      setSendingInvitation(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F3EC] flex items-center justify-center">
        <div className="w-7 h-7 border-2 border-[#8B1A1A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!participant) return null;

  const pct = Math.min(100, Math.round((participant.totalPaid / TOTAL) * 100));
  const canSendInvitation = participant.totalPaid >= TOTAL && !participant.invitationSent;

  const statusConfig = {
    pending: { label: "En attente", className: "status-pending" },
    validated: { label: "Validé ✓", className: "status-validated" },
    invited: { label: "Invitation envoyée ✓", className: "status-invited" },
  };
  const sc = statusConfig[participant.status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <div className="min-h-screen bg-[#F8F3EC]">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#F0E8D0] px-4 py-3" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <button onClick={() => router.back()} className="p-1.5 text-[#888] hover:text-[#8B1A1A] transition-colors">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#1A1A1A] truncate leading-none">{participant.fullName}</p>
            <p className="text-[10px] text-[#AAA] mt-0.5 font-mono">{participant.translatorId}</p>
          </div>
          <span className={`${sc.className} text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0`}>{sc.label}</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        {/* Alerts */}
        {successMsg && (
          <div className="p-3 bg-[#D4EDDA] border border-[#A8D5B5] rounded text-xs text-[#155724] font-medium">{successMsg}</div>
        )}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700">{errorMsg}</div>
        )}

        {/* Contribution card */}
        <div
          className="bg-white border border-[#F0E8D0] rounded-lg p-5"
          style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#1A1A1A]">Contribution</h2>
            <button
              onClick={() => setShowPaymentForm(!showPaymentForm)}
              className="flex items-center gap-1.5 text-xs text-[#8B1A1A] border border-[#E8D5B0] rounded px-3 py-1.5 hover:bg-[#FDF8F0] transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Ajouter versement
            </button>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-light text-[#555]">Total versé</span>
              <span className="font-semibold text-[#1A1A1A]">{participant.totalPaid.toLocaleString("fr-FR")} FCFA</span>
            </div>
            <div className="progress-track h-3 w-full rounded-full overflow-hidden">
              <div className="progress-fill h-full" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex justify-between text-xs mt-1.5 text-[#AAA]">
              <span>{pct}%</span>
              <span>Objectif : {TOTAL.toLocaleString("fr-FR")} FCFA</span>
            </div>
          </div>

          {participant.remaining > 0 ? (
            <div className="text-center p-3 bg-[#FEF3CD] border border-[#F0D070] rounded">
              <p className="text-xs text-[#92650A] font-medium">
                Reste à verser : <strong>{participant.remaining.toLocaleString("fr-FR")} FCFA</strong>
              </p>
            </div>
          ) : (
            <div className="text-center p-3 bg-[#D4EDDA] border border-[#A8D5B5] rounded">
              <p className="text-xs text-[#155724] font-medium">Contribution complète ✓</p>
            </div>
          )}

          {/* Add payment form */}
          {showPaymentForm && (
            <div className="mt-4 pt-4 border-t border-[#F0E8D0] space-y-3">
              <p className="text-xs text-[#888] font-medium uppercase tracking-wider">Nouveau versement</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Montant (FCFA)"
                  className="flex-1 px-3 py-2.5 border border-[#E8D5B0] rounded text-sm outline-none focus:border-[#8B1A1A] transition-colors"
                  inputMode="numeric"
                  min="100"
                  max={TOTAL}
                />
              </div>
              <input
                type="text"
                value={paymentNote}
                onChange={(e) => setPaymentNote(e.target.value)}
                placeholder="Note (facultatif)"
                className="w-full px-3 py-2.5 border border-[#E8D5B0] rounded text-sm outline-none focus:border-[#8B1A1A] transition-colors"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddPayment}
                  disabled={addingPayment || !paymentAmount}
                  className="flex-1 py-3 bg-[#8B1A1A] text-white text-sm rounded hover:bg-[#6B1313] transition-colors disabled:opacity-50"
                >
                  {addingPayment ? "Enregistrement..." : "Enregistrer"}
                </button>
                <button
                  onClick={() => setShowPaymentForm(false)}
                  className="px-4 py-3 border border-[#E8D5B0] rounded text-sm text-[#888] hover:border-[#C9A96E] transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Send invitation */}
        {canSendInvitation && (
          <button
            onClick={handleSendInvitation}
            disabled={sendingInvitation}
            className="w-full py-4 bg-[#155724] text-white text-sm font-medium rounded-lg tracking-wide transition-all hover:bg-[#0D4020] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {sendingInvitation ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Génération et envoi...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M14.5 1.5L7 9M14.5 1.5H9.5M14.5 1.5V6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6.5 3H2.5C1.948 3 1.5 3.448 1.5 4V13.5C1.5 14.052 1.948 14.5 2.5 14.5H12C12.552 14.5 13 14.052 13 13.5V9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                Envoyer l'invitation officielle
              </>
            )}
          </button>
        )}

        {participant.invitationSent && (
          <div className="p-4 bg-[#D1E7FF] border border-[#90C4F0] rounded-lg text-center">
            <p className="text-sm text-[#0A4A8A] font-medium">Invitation envoyée ✓</p>
            {participant.invitationSentAt && (
              <p className="text-xs text-[#5090C0] mt-1">
                {new Date(participant.invitationSentAt).toLocaleDateString("fr-FR", {
                  day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                })}
              </p>
            )}
          </div>
        )}

        {/* Info */}
        <div className="bg-white border border-[#F0E8D0] rounded-lg p-5" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
          <h2 className="text-sm font-semibold text-[#1A1A1A] mb-4">Informations</h2>
          <div className="space-y-3">
            {[
              { label: "E-mail", value: participant.email, icon: "✉" },
              { label: "Téléphone", value: participant.phone, icon: "☏" },
              { label: "Ville", value: participant.city, icon: "◎" },
              { label: "Participation", value: participant.participates ? "Confirmée ✓" : "Non confirmée", icon: "◇" },
              { label: "Date d'inscription", value: new Date(participant.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }), icon: "◷" },
            ].map((item) => (
              <div key={item.label} className="flex gap-3 text-sm">
                <span className="text-[#CCC] w-5 flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="text-[10px] text-[#AAA] uppercase tracking-wider mb-0.5">{item.label}</p>
                  <p className="text-[#333] font-light">{item.value}</p>
                </div>
              </div>
            ))}
            {participant.comment && (
              <div className="flex gap-3 text-sm">
                <span className="text-[#CCC] w-5 flex-shrink-0">✎</span>
                <div>
                  <p className="text-[10px] text-[#AAA] uppercase tracking-wider mb-0.5">Commentaire</p>
                  <p className="text-[#555] font-light italic">{participant.comment}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment history */}
        <div className="bg-white border border-[#F0E8D0] rounded-lg p-5" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
          <h2 className="text-sm font-semibold text-[#1A1A1A] mb-4">
            Historique des versements ({participant.payments.length})
          </h2>
          {participant.payments.length === 0 ? (
            <p className="text-xs text-[#CCC] text-center py-4">Aucun versement enregistré</p>
          ) : (
            <div className="space-y-2">
              {participant.payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between py-2.5 border-b border-[#F5F0E8] last:border-0">
                  <div>
                    <p className="text-sm font-medium text-[#155724]">+{payment.amount.toLocaleString("fr-FR")} FCFA</p>
                    {payment.note && <p className="text-xs text-[#AAA] mt-0.5">{payment.note}</p>}
                  </div>
                  <p className="text-[11px] text-[#CCC]">
                    {new Date(payment.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              ))}
              <div className="flex justify-between pt-2 text-sm border-t-2 border-[#E8D5B0]">
                <span className="font-medium text-[#888]">Total</span>
                <span className="font-semibold text-[#1A1A1A]">{participant.totalPaid.toLocaleString("fr-FR")} FCFA</span>
              </div>
            </div>
          )}
        </div>

        {/* Activity history */}
        <div className="bg-white border border-[#F0E8D0] rounded-lg p-5" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
          <h2 className="text-sm font-semibold text-[#1A1A1A] mb-4">Journal d'activité</h2>
          {participant.history.length === 0 ? (
            <p className="text-xs text-[#CCC] text-center py-4">Aucune activité</p>
          ) : (
            <div className="space-y-3">
              {participant.history.map((log) => (
                <div key={log.id} className="flex gap-3 text-xs">
                  <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#C9A96E] mt-1.5" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-medium text-[#333]">{actionLabels[log.action] || log.action}</span>
                      <span className="text-[#CCC] flex-shrink-0">
                        {new Date(log.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    {log.details && <p className="text-[#888] mt-0.5 leading-relaxed">{log.details}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

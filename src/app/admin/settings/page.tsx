"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Settings {
  title: string;
  titleEn: string;
  titleZh: string;
  eventDate: string;
  eventLocation: string;
  totalRequired: number;
  year: number;
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>({
    title: "",
    titleEn: "",
    titleZh: "",
    eventDate: "",
    eventLocation: "",
    totalRequired: 25000,
    year: new Date().getFullYear(),
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [bulkSending, setBulkSending] = useState(false);
  const [bulkResult, setBulkResult] = useState<{ sent: number; total: number; errors?: string[] } | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => {
        if (r.status === 401) { router.push("/admin/login"); return null; }
        return r.json();
      })
      .then((data) => { if (data) setSettings(data); })
      .finally(() => setLoading(false));
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleBulkSend = async () => {
    if (!confirm("Envoyer les invitations PDF à tous les participants validés non encore invités ?")) return;
    setBulkSending(true);
    setBulkResult(null);
    try {
      const res = await fetch("/api/admin/bulk-send", { method: "POST" });
      const data = await res.json();
      setBulkResult(data);
    } finally {
      setBulkSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-6 h-6 border-2 border-[#8B1A1A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 border border-[#E8D5B0] rounded text-sm bg-white outline-none focus:border-[#8B1A1A] transition-colors font-light";
  const labelClass = "block text-xs text-[#888] tracking-wider uppercase mb-2 font-light";

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* Event info form */}
      <div className="bg-white border border-[#F0E8D0] rounded-lg p-5" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
        <h2 className="text-sm font-semibold text-[#1A1A1A] mb-5 flex items-center gap-2">
          <span className="w-1 h-4 bg-[#8B1A1A] rounded-full inline-block" />
          Configuration de l'événement
        </h2>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className={labelClass}>Titre (français)</label>
              <input type="text" value={settings.title}
                onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Titre (anglais)</label>
              <input type="text" value={settings.titleEn}
                onChange={(e) => setSettings({ ...settings, titleEn: e.target.value })}
                className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Titre (chinois)</label>
              <input type="text" value={settings.titleZh}
                onChange={(e) => setSettings({ ...settings, titleZh: e.target.value })}
                className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Date de l'événement</label>
              <input type="text" value={settings.eventDate}
                onChange={(e) => setSettings({ ...settings, eventDate: e.target.value })}
                placeholder="ex. 15 mars 2025"
                className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Année</label>
              <input type="number" value={settings.year}
                onChange={(e) => setSettings({ ...settings, year: parseInt(e.target.value) || new Date().getFullYear() })}
                className={inputClass} min="2024" max="2030" />
            </div>
          </div>

          <div>
            <label className={labelClass}>Lieu de l'événement</label>
            <input type="text" value={settings.eventLocation}
              onChange={(e) => setSettings({ ...settings, eventLocation: e.target.value })}
              placeholder="ex. Hôtel Ivoire, Abidjan"
              className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Contribution requise (FCFA)</label>
            <input type="number" value={settings.totalRequired}
              onChange={(e) => setSettings({ ...settings, totalRequired: parseFloat(e.target.value) || 25000 })}
              className={inputClass} min="1000" step="500" />
            <p className="text-[11px] text-[#BBB] mt-1">
              Montant total à atteindre pour déclencher la validation automatique.
            </p>
          </div>

          {saved && (
            <div className="p-3 bg-[#D4EDDA] border border-[#A8D5B5] rounded text-xs text-[#155724] font-medium">
              ✓ Paramètres sauvegardés avec succès.
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 bg-[#8B1A1A] text-white text-sm tracking-widest uppercase rounded hover:bg-[#6B1313] transition-colors disabled:opacity-50"
          >
            {saving ? "Sauvegarde..." : "Sauvegarder les paramètres"}
          </button>
        </form>
      </div>

      {/* Bulk send */}
      <div className="bg-white border border-[#F0E8D0] rounded-lg p-5" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
        <h2 className="text-sm font-semibold text-[#1A1A1A] mb-2 flex items-center gap-2">
          <span className="w-1 h-4 bg-[#155724] rounded-full inline-block" />
          Envoi groupé des invitations
        </h2>
        <p className="text-xs text-[#888] font-light mb-5 leading-relaxed">
          Envoie automatiquement les invitations PDF à tous les participants dont la contribution est complète et qui n'ont pas encore reçu leur invitation.
        </p>

        {bulkResult && (
          <div className={`p-3 rounded border text-xs mb-4 ${
            bulkResult.errors?.length
              ? "bg-yellow-50 border-yellow-200 text-yellow-800"
              : "bg-[#D4EDDA] border-[#A8D5B5] text-[#155724]"
          }`}>
            <p className="font-medium">
              {bulkResult.sent} invitation{bulkResult.sent > 1 ? "s" : ""} envoyée{bulkResult.sent > 1 ? "s" : ""}
              {bulkResult.total > bulkResult.sent ? ` sur ${bulkResult.total} éligibles` : ""}.
            </p>
            {bulkResult.errors && bulkResult.errors.length > 0 && (
              <div className="mt-2">
                <p className="font-medium text-yellow-700">Échecs :</p>
                {bulkResult.errors.map((e, i) => (
                  <p key={i} className="text-yellow-600 mt-0.5">{e}</p>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleBulkSend}
          disabled={bulkSending}
          className="w-full py-3.5 bg-[#155724] text-white text-sm tracking-wide rounded hover:bg-[#0D4020] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {bulkSending ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M13 1L6 8M13 1H9M13 1V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 3H2.5C1.948 3 1.5 3.448 1.5 4V11.5C1.5 12.052 1.948 12.5 2.5 12.5H10C10.552 12.5 11 12.052 11 11.5V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              Envoyer toutes les invitations en attente
            </>
          )}
        </button>
      </div>

      {/* Danger zone */}
      <div className="bg-white border border-[#F0E8D0] rounded-lg p-5" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
        <h2 className="text-sm font-semibold text-[#1A1A1A] mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-[#C9A96E] rounded-full inline-block" />
          Outils
        </h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="/api/admin/export"
            className="flex items-center gap-2 px-4 py-2.5 border border-[#E8D5B0] rounded text-xs text-[#555] hover:border-[#C9A96E] hover:text-[#333] transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 1v7M3.5 5.5l3 3 3-3M2 10h9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Exporter CSV
          </a>
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 border border-[#E8D5B0] rounded text-xs text-[#555] hover:border-[#C9A96E] hover:text-[#333] transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M5 2H2a1 1 0 00-1 1v8a1 1 0 001 1h9a1 1 0 001-1V8M8 1h4v4M12 1L6 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Voir le site public
          </a>
        </div>
      </div>
    </div>
  );
}

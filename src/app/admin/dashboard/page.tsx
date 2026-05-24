"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import StatCard from "@/components/admin/StatCard";
import ParticipantCard from "@/components/admin/ParticipantCard";

interface Stats {
  total: number;
  pending: number;
  validated: number;
  invited: number;
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
  participates: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, validated: 0, invited: 0 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (statusFilter) params.set("status", statusFilter);
      params.set("page", String(page));
      params.set("limit", "12");

      const res = await fetch(`/api/admin/participants?${params}`);
      if (res.status === 401) { router.push("/admin/login"); return; }
      const data = await res.json();
      setParticipants(data.participants || []);
      setStats(data.stats || {});
      setTotalCount(data.total || 0);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page, router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const statusFilters = [
    { val: "", label: "Tous" },
    { val: "pending", label: "En attente" },
    { val: "validated", label: "Validés" },
    { val: "invited", label: "Invités" },
  ];

  return (
    <div className="bg-[#F8F3EC] min-h-[calc(100vh-56px)]">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Total inscrits" value={stats.total} color="#1A1A1A" />
          <StatCard label="En attente" value={stats.pending} color="#92650A" />
          <StatCard label="Validés" value={stats.validated} color="#155724" />
          <StatCard label="Invitations envoyées" value={stats.invited} color="#0A4A8A" />
        </div>

        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CCC]" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher par nom, e-mail, téléphone ou matricule..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-[#E8D5B0] rounded-lg text-sm outline-none focus:border-[#8B1A1A] transition-colors"
          />
        </div>

        {/* Status filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {statusFilters.map((f) => (
            <button
              key={f.val}
              onClick={() => { setStatusFilter(f.val); setPage(1); }}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs transition-all duration-200 border font-medium
                ${statusFilter === f.val
                  ? "bg-[#8B1A1A] text-white border-[#8B1A1A]"
                  : "bg-white text-[#888] border-[#E8D5B0] hover:border-[#C9A96E]"}
              `}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-6 h-6 border-2 border-[#8B1A1A] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : participants.length === 0 ? (
          <div className="text-center py-16 text-[#AAA] text-sm">
            <p className="text-3xl mb-3 opacity-30">中</p>
            Aucun participant trouvé
          </div>
        ) : (
          <div className="space-y-3">
            {participants.map((p) => <ParticipantCard key={p.id} p={p} />)}
          </div>
        )}

        {/* Pagination */}
        {totalCount > 12 && (
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-xs border border-[#E8D5B0] rounded text-[#888] disabled:opacity-40 hover:border-[#C9A96E] transition-colors"
            >
              ← Précédent
            </button>
            <span className="text-xs text-[#AAA]">
              Page {page} · {totalCount} total
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page * 12 >= totalCount}
              className="px-4 py-2 text-xs border border-[#E8D5B0] rounded text-[#888] disabled:opacity-40 hover:border-[#C9A96E] transition-colors"
            >
              Suivant →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });

  // Redirect if already logged in
  useEffect(() => {
    fetch("/api/admin/participants?limit=1").then((res) => {
      if (res.ok) router.replace("/admin/dashboard");
    });
  }, [router]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        setError("Identifiant ou mot de passe incorrect.");
      } else {
        router.push("/admin/dashboard");
      }
    } catch {
      setError("Erreur de connexion. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 pattern-bg"
      style={{ background: "linear-gradient(135deg, #1A1A1A 0%, #2D2020 50%, #1A1A1A 100%)" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 border border-[#C9A96E] rounded mb-4">
            <span className="text-[#C9A96E] text-xl" style={{ fontFamily: "serif" }}>中</span>
          </div>
          <h1
            className="text-xl font-light text-white tracking-widest mb-1"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Administration
          </h1>
          <p className="text-xs text-[#666] tracking-[0.2em]">中文译者年会</p>
        </div>

        {/* Form */}
        <div
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-7"
          style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-[#999] tracking-wider uppercase mb-2">Identifiant</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full bg-white/10 border border-white/20 text-white px-4 py-3.5 rounded text-sm outline-none focus:border-[#C9A96E] transition-colors placeholder:text-white/30"
                placeholder="admin"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-xs text-[#999] tracking-wider uppercase mb-2">Mot de passe</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-white/10 border border-white/20 text-white px-4 py-3.5 rounded text-sm outline-none focus:border-[#C9A96E] transition-colors placeholder:text-white/30"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-900/20 border border-red-800/30 px-3 py-2 rounded">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#8B1A1A] hover:bg-[#6B1313] text-white text-sm tracking-widest uppercase transition-all duration-200 rounded disabled:opacity-50"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-[#444] mt-6 tracking-wider">
          Accès réservé aux administrateurs de la conférence
        </p>

        <div className="text-center mt-3">
          <a href="/" className="text-xs text-[#555] hover:text-[#888] transition-colors">
            ← Retour au site
          </a>
        </div>
      </div>
    </div>
  );
}

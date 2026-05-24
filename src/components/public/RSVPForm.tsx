"use client";

import { useState } from "react";
import type { Translations, Locale } from "@/i18n";
import { Ornament } from "@/components/ui/Ornament";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  translatorId: string;
  city: string;
  participates: boolean;
  comment: string;
}

export default function RSVPForm({ t, locale }: { t: Translations; locale: Locale }) {
  const [form, setForm] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    translatorId: "",
    city: "",
    participates: true,
    comment: "",
  });
  const [errors, setErrors] = useState<Partial<FormData & { general: string }>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!form.fullName.trim()) e.fullName = t.form.required;
    if (!form.email.trim()) e.email = t.form.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t.form.invalidEmail;
    if (!form.phone.trim()) e.phone = t.form.required;
    if (!form.translatorId.trim()) e.translatorId = t.form.required;
    if (!form.city.trim()) e.city = t.form.required;
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, language: locale }),
      });

      if (res.status === 409) {
        setErrors({ general: t.form.errorDuplicate });
      } else if (!res.ok) {
        setErrors({ general: t.form.errorGeneral });
      } else {
        setSuccess(true);
      }
    } catch {
      setErrors({ general: t.form.errorGeneral });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <section id="rsvp" className="py-16 px-6 bg-[#FDFCF8]">
        <div className="max-w-md mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D4EDDA] border border-[#A8D5B5] mb-6">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M6 14l5 5 11-11" stroke="#155724" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2
            className="text-2xl font-light text-[#1A1A1A] mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {t.form.successTitle}
          </h2>
          <Ornament className="mb-6" />
          <p className="text-sm text-[#666] leading-relaxed font-light mb-8">{t.form.successDesc}</p>
          <div className="p-4 bg-[#FDF8F0] border border-[#E8D5B0] rounded">
            <p className="text-xs text-[#AAA] tracking-wider uppercase mb-1">Statut actuel</p>
            <div className="status-pending inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-[#D4A000]" />
              En attente de validation de contribution
            </div>
          </div>
        </div>
      </section>
    );
  }

  const inputClass = (field: keyof typeof errors) =>
    `w-full px-4 py-3.5 border rounded text-sm bg-white text-[#1A1A1A] outline-none transition-all duration-200 font-light
    focus:border-[#8B1A1A] focus:ring-1 focus:ring-[#8B1A1A] focus:ring-opacity-20
    ${errors[field] ? "border-red-400 bg-red-50" : "border-[#E8D5B0]"}`;

  return (
    <section id="rsvp" className="py-16 px-6" style={{ background: "linear-gradient(180deg, #F8F3EC, #FDFCF8)" }}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-[10px] tracking-[0.3em] text-[#C9A96E] uppercase font-light block mb-3">
            {t.form.chinese}
          </span>
          <h2
            className="text-2xl font-light tracking-wide text-[#1A1A1A] mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {t.form.title}
          </h2>
          <Ornament />
          <p className="mt-4 text-sm text-[#777] font-light">{t.form.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Full name */}
          <div>
            <label className="block text-xs text-[#888] tracking-wider uppercase mb-2 font-light">
              {t.form.fullName} <span className="text-[#8B1A1A]">*</span>
            </label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder={t.form.fullNamePlaceholder}
              className={inputClass("fullName")}
              autoComplete="name"
            />
            {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs text-[#888] tracking-wider uppercase mb-2 font-light">
              {t.form.email} <span className="text-[#8B1A1A]">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder={t.form.emailPlaceholder}
              className={inputClass("email")}
              autoComplete="email"
              inputMode="email"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs text-[#888] tracking-wider uppercase mb-2 font-light">
              {t.form.phone} <span className="text-[#8B1A1A]">*</span>
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder={t.form.phonePlaceholder}
              className={inputClass("phone")}
              autoComplete="tel"
              inputMode="tel"
            />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
          </div>

          {/* Translator ID */}
          <div>
            <label className="block text-xs text-[#888] tracking-wider uppercase mb-2 font-light">
              {t.form.translatorId} <span className="text-[#8B1A1A]">*</span>
            </label>
            <input
              type="text"
              value={form.translatorId}
              onChange={(e) => setForm({ ...form, translatorId: e.target.value })}
              placeholder={t.form.translatorIdPlaceholder}
              className={inputClass("translatorId")}
              autoComplete="off"
            />
            {errors.translatorId && <p className="mt-1 text-xs text-red-500">{errors.translatorId}</p>}
          </div>

          {/* City */}
          <div>
            <label className="block text-xs text-[#888] tracking-wider uppercase mb-2 font-light">
              {t.form.city} <span className="text-[#8B1A1A]">*</span>
            </label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder={t.form.cityPlaceholder}
              className={inputClass("city")}
              autoComplete="address-level2"
            />
            {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
          </div>

          {/* Participation */}
          <div>
            <label className="block text-xs text-[#888] tracking-wider uppercase mb-3 font-light">
              {t.form.participates} <span className="text-[#8B1A1A]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { val: true, label: t.form.participatesYes },
                { val: false, label: t.form.participatesNo },
              ].map(({ val, label }) => (
                <button
                  key={String(val)}
                  type="button"
                  onClick={() => setForm({ ...form, participates: val })}
                  className={`p-3 border rounded text-sm transition-all duration-200 text-left font-light leading-tight
                    ${
                      form.participates === val
                        ? val
                          ? "border-[#8B1A1A] bg-[#FFF0F0] text-[#8B1A1A]"
                          : "border-[#888] bg-[#F5F5F5] text-[#555]"
                        : "border-[#E8D5B0] text-[#888] hover:border-[#C9A96E]"
                    }
                  `}
                >
                  <span className={`block w-3 h-3 rounded-full border mb-1.5 ${form.participates === val ? (val ? "bg-[#8B1A1A] border-[#8B1A1A]" : "bg-[#888] border-[#888]") : "border-[#CCC]"}`} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs text-[#888] tracking-wider uppercase mb-2 font-light">
              {t.form.comment}
            </label>
            <textarea
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              placeholder={t.form.commentPlaceholder}
              rows={3}
              className="w-full px-4 py-3.5 border border-[#E8D5B0] rounded text-sm bg-white text-[#1A1A1A] outline-none transition-all duration-200 font-light resize-none focus:border-[#8B1A1A] focus:ring-1 focus:ring-[#8B1A1A] focus:ring-opacity-20"
            />
          </div>

          {/* Error */}
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-600">
              {errors.general}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-4 text-sm tracking-widest uppercase font-medium transition-all duration-300 rounded
              ${submitting
                ? "bg-[#D5A0A0] text-white cursor-not-allowed"
                : "bg-[#8B1A1A] text-white hover:bg-[#6B1313] active:scale-98"
              }
            `}
            style={{ letterSpacing: "0.15em" }}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t.form.submitting}
              </span>
            ) : (
              t.form.submit
            )}
          </button>

          <p className="text-center text-[11px] text-[#AAA] tracking-wide">
            En soumettant ce formulaire, vous acceptez d'être contacté par l'administrateur de la conférence.
          </p>
        </form>
      </div>
    </section>
  );
}

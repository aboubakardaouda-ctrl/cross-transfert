import type { Translations } from "@/i18n";

export default function Footer({ t }: { t: Translations }) {
  return (
    <footer className="bg-[#1A1A1A] text-white py-10 px-6">
      <div className="max-w-md mx-auto text-center">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-10 h-10 border border-[#C9A96E] rounded flex items-center justify-center">
            <span className="text-[#C9A96E] text-base" style={{ fontFamily: "serif" }}>中</span>
          </div>
        </div>

        <p
          className="text-sm font-light text-[#CCC] tracking-widest mb-1"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          {t.footer.association}
        </p>
        <p className="text-xs text-[#666] tracking-[0.2em] mb-6">{t.footer.chinese}</p>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-16 bg-[#333]" />
          <div className="w-1 h-1 rounded-full bg-[#C9A96E]" />
          <div className="h-px w-16 bg-[#333]" />
        </div>

        <p className="text-xs text-[#555] tracking-wider">
          © {new Date().getFullYear()} {t.footer.site} · {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}

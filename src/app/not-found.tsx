import Link from "next/link";
import { Ornament } from "@/components/ui/Ornament";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center pattern-bg"
      style={{ background: "linear-gradient(180deg, #FDFCF8 0%, #F5F0E8 100%)" }}
    >
      <div className="max-w-sm mx-auto">
        <p
          className="text-8xl font-light text-[#E8D5B0] mb-4"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          404
        </p>
        <p className="text-xs tracking-[0.3em] text-[#C9A96E] uppercase mb-4">Page introuvable</p>
        <h1
          className="text-xl font-light text-[#1A1A1A] mb-4"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          Cette page n'existe pas
        </h1>
        <Ornament className="mb-6" />
        <p className="text-sm text-[#888] font-light mb-8 leading-relaxed">
          La page que vous recherchez est introuvable. Revenez à l'accueil pour confirmer votre participation.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#8B1A1A] text-white px-6 py-3 text-xs tracking-widest uppercase rounded hover:bg-[#6B1313] transition-colors"
        >
          ← Retour à l'accueil
        </Link>
        <p className="mt-6 text-xs text-[#CCC] tracking-wider">中文译者年会</p>
      </div>
    </div>
  );
}

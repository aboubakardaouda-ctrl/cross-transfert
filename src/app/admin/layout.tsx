"use client";

import { usePathname, useRouter } from "next/navigation";

const NAV = [
  {
    href: "/admin/dashboard",
    label: "Tableau de bord",
    icon: (active: boolean) => (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1" stroke={active ? "#8B1A1A" : "currentColor"} strokeWidth="1.2" />
        <rect x="9" y="1" width="6" height="6" rx="1" stroke={active ? "#8B1A1A" : "currentColor"} strokeWidth="1.2" />
        <rect x="1" y="9" width="6" height="6" rx="1" stroke={active ? "#8B1A1A" : "currentColor"} strokeWidth="1.2" />
        <rect x="9" y="9" width="6" height="6" rx="1" stroke={active ? "#8B1A1A" : "currentColor"} strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    href: "/admin/settings",
    label: "Événement",
    icon: (active: boolean) => (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke={active ? "#8B1A1A" : "currentColor"} strokeWidth="1.2" />
        <path d="M8 4v4l3 2" stroke={active ? "#8B1A1A" : "currentColor"} strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const isLogin = pathname === "/admin/login";
  if (isLogin) return <>{children}</>;

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#F8F3EC] flex flex-col">
      {/* Top bar */}
      <header
        className="sticky top-0 z-30 bg-white border-b border-[#F0E8D0]"
        style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
      >
        <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#8B1A1A] rounded flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs" style={{ fontFamily: "serif" }}>中</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-[#1A1A1A] leading-none">Administration</p>
              <p className="text-[10px] text-[#AAA] tracking-wider">中文译者年会</p>
            </div>
          </div>

          {/* Nav tabs */}
          <nav className="flex items-center gap-1">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded text-xs transition-all duration-200
                    ${active
                      ? "bg-[#FDF0F0] text-[#8B1A1A] font-medium"
                      : "text-[#888] hover:text-[#555] hover:bg-[#F8F3EC]"
                    }`}
                >
                  {item.icon(active)}
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <button
            onClick={handleLogout}
            className="text-xs text-[#888] hover:text-[#8B1A1A] transition-colors flex items-center gap-1.5 px-2 py-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 12H2a1 1 0 01-1-1V3a1 1 0 011-1h3M9 10l3-3-3-3M12 7H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="hidden sm:inline">Déco.</span>
          </button>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}

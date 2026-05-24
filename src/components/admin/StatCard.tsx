export default function StatCard({
  label,
  value,
  color = "#1A1A1A",
  icon,
}: {
  label: string;
  value: number | string;
  color?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className="bg-white border border-[#F0E8D0] rounded-lg p-4 flex flex-col gap-1"
      style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-[#999] tracking-wider uppercase font-light">{label}</span>
        {icon && <span className="opacity-50">{icon}</span>}
      </div>
      <span className="text-3xl font-light" style={{ color, fontFamily: "var(--font-playfair), Georgia, serif" }}>
        {value}
      </span>
    </div>
  );
}

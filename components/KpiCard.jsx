export default function KpiCard({ label, value, sub }) {
  return (
    <div className="relative bg-gradient-to-br from-panel via-panel to-panel2 rounded-2xl p-3.5 md:p-4 border border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 via-transparent to-transparent pointer-events-none" />
      <div className="relative">
        <div className="text-[10px] md:text-[11px] uppercase tracking-[0.16em] text-white/50">
          {label}
        </div>
        <div className="text-xl md:text-2xl font-semibold mt-1">
          {value}
        </div>
        {sub && (
          <div className="text-[11px] text-white/40 mt-1">
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

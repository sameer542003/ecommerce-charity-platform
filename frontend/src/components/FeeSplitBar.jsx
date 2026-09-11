export default function FeeSplitBar({ donation_fee = 70, platform_fee = 10, profit = 20 }) {
  const segments = [
    { label: "To the charity", value: donation_fee, color: "var(--moss)" },
    { label: "Platform costs", value: platform_fee, color: "var(--line)" },
    { label: "Seller profit", value: profit, color: "var(--gold)" },
  ];

  return (
    <div>
      <div className="flex h-2.5 w-full overflow-hidden rounded-none border border-[var(--line)]">
        {segments.map((s) => (
          <div
            key={s.label}
            style={{ width: `${s.value}%`, background: s.color }}
            title={`${s.label}: ${s.value}%`}
          />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[var(--ink-soft)]">
        {segments.map((s) => (
          <span key={s.label} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2"
              style={{ background: s.color }}
            />
            {s.label} · <span className="tabular">{s.value}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}

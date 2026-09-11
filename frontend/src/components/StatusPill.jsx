const TONES = {
  live: { bg: "var(--moss)", fg: "#fff" },
  active: { bg: "var(--moss)", fg: "#fff" },
  approved: { bg: "var(--moss)", fg: "#fff" },
  delivered: { bg: "var(--moss)", fg: "#fff" },
  confirmed: { bg: "var(--gold)", fg: "#fff" },
  shipped: { bg: "var(--gold)", fg: "#fff" },
  pending: { bg: "var(--gold-soft)", fg: "var(--ink)" },
  sold: { bg: "var(--clay-soft)", fg: "var(--clay)" },
  closed: { bg: "var(--clay-soft)", fg: "var(--clay)" },
  cancelled: { bg: "var(--clay-soft)", fg: "var(--clay)" },
  inactive: { bg: "#e2e2da", fg: "var(--ink-soft)" },
};

export default function StatusPill({ status }) {
  const tone = TONES[status] || TONES.inactive;
  return (
    <span
      className="inline-block px-2 py-0.5 text-xs font-medium rounded-sm"
      style={{ background: tone.bg, color: tone.fg }}
    >
      {status}
    </span>
  );
}

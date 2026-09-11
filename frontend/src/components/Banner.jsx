export default function Banner({ tone = "error", children }) {
  if (!children) return null;
  const styles =
    tone === "error"
      ? "border-[var(--clay)] bg-[var(--clay-soft)] text-[var(--clay)]"
      : "border-[var(--moss)] bg-[#DDE6DE] text-[var(--moss-dark)]";
  return (
    <div className={`border px-4 py-3 text-sm ${styles}`} role="status">
      {children}
    </div>
  );
}

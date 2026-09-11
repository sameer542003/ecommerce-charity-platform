export default function Field({ label, children, hint, error }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1.5">{label}</span>
      {children}
      {hint && !error && (
        <span className="block text-xs text-[var(--ink-soft)] mt-1">{hint}</span>
      )}
      {error && <span className="block text-xs text-[var(--clay)] mt-1">{error}</span>}
    </label>
  );
}

export const inputClass =
  "w-full border border-[var(--line)] bg-[var(--paper-raised)] px-3 py-2 text-sm focus:border-[var(--moss)] outline-none";

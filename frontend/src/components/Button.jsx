export default function Button({
  children,
  variant = "primary",
  className = "",
  ...rest
}) {
  const base = "px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-[var(--moss)] text-white hover:bg-[var(--moss-dark)]",
    outline: "border border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)]",
    ghost: "text-[var(--ink-soft)] hover:text-[var(--ink)]",
    danger: "bg-[var(--clay)] text-white hover:opacity-90",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

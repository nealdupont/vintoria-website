export function Eyebrow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.28em] text-muted ${className}`}
    >
      <span aria-hidden className="h-px w-6 bg-gold/70" />
      {children}
    </span>
  );
}

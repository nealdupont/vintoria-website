import Link from "next/link";

type Variant = "solid" | "outline" | "ghost" | "wine";

const base =
  "group inline-flex items-center justify-center gap-2.5 rounded-full font-medium transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-gold";

const variants: Record<Variant, string> = {
  solid:
    "bg-gold px-7 py-3.5 text-[0.72rem] uppercase tracking-[0.16em] text-[#1B140F] hover:-translate-y-0.5 hover:bg-gold-strong hover:shadow-[0_0_28px_-6px_rgba(212,185,106,0.5)]",
  wine: "bg-wine px-7 py-3.5 text-[0.72rem] uppercase tracking-[0.16em] text-mist hover:-translate-y-0.5 hover:bg-[#6f2842]",
  outline:
    "border border-border px-7 py-3.5 text-[0.9rem] text-mist hover:-translate-y-0.5 hover:border-border-hover hover:bg-white/[0.03]",
  ghost: "px-2 py-2 text-[0.9rem] text-muted hover:text-mist",
};

const arrow = (
  <span
    aria-hidden
    className="translate-x-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
  >
    →
  </span>
);

export function Button({
  children,
  href,
  variant = "solid",
  withArrow = false,
  className = "",
}: {
  children: React.ReactNode;
  href: string;
  variant?: Variant;
  withArrow?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
      {withArrow && arrow}
    </Link>
  );
}

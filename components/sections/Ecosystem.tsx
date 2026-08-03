import type { Dictionary } from "@/i18n/getDictionary";
import { Reveal } from "@/components/ui/Reveal";

export function Ecosystem({ dict }: { dict: Dictionary }) {
  const t = dict.ecosystem;
  return (
    <section className="section-x py-16">
      <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-3 rounded-2xl border border-line-soft bg-white/[0.02] px-8 py-8 text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold">
          {t.eyebrow}
        </span>
        <h3 className="font-serif text-xl text-mist">{t.heading}</h3>
        <p className="max-w-xl text-[0.95rem] leading-relaxed text-muted">
          {t.body}
        </p>
      </Reveal>
    </section>
  );
}

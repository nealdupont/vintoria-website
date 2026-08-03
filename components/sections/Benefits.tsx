import type { Dictionary } from "@/i18n/getDictionary";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { Ignite } from "@/components/ui/Ignite";

export function Benefits({ dict }: { dict: Dictionary }) {
  const t = dict.benefits;
  return (
    <section id="benefits" className="scroll-mt-24 py-[var(--spacing-section)]">
      <div className="section-x mx-auto max-w-6xl">
        <Reveal className="mb-14 max-w-2xl">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h2 className="mt-6 font-serif text-[clamp(2.1rem,4.6vw,3.6rem)] leading-[1.03] tracking-[-0.015em] text-mist">
            {t.heading}
          </h2>
        </Reveal>

        <Reveal stagger role="list" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.items.map((item, i) => (
            <RevealItem
              key={item.title}
              role="listitem"
              className="glass relative flex flex-col rounded-2xl p-7 transition-colors duration-500 hover:border-gold/25"
            >
              <span className="font-mono text-[12px] tracking-[0.18em] text-gold">
                0{i + 1}
              </span>
              <h3 className="mt-5 font-serif text-2xl leading-tight text-mist">
                {item.title}
              </h3>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-muted">
                {item.body}
              </p>
              <Ignite radius="rounded-2xl" />
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

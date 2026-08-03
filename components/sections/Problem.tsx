import type { Dictionary } from "@/i18n/getDictionary";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { Ignite } from "@/components/ui/Ignite";

export function Problem({ dict }: { dict: Dictionary }) {
  const t = dict.problem;
  return (
    <section id="problem" className="scroll-mt-24 py-[var(--spacing-section)]">
      <div className="section-x mx-auto max-w-6xl">
        <Reveal stagger className="max-w-3xl">
          <RevealItem>
            <Eyebrow>{t.eyebrow}</Eyebrow>
          </RevealItem>
          <RevealItem
            as="p"
            className="mt-6 font-serif text-[clamp(2.1rem,4.8vw,3.6rem)] font-medium leading-[1.06] tracking-[-0.01em] text-mist"
          >
            {t.heading}
          </RevealItem>
          <RevealItem
            as="p"
            className="mt-6 max-w-xl text-[1.1rem] leading-relaxed text-muted"
          >
            {t.intro}
          </RevealItem>
        </Reveal>

        <Reveal stagger role="list" className="mt-14 grid gap-5 md:grid-cols-3">
          {t.points.map((p) => (
            <RevealItem
              key={p.title}
              role="listitem"
              className="vintoria-card relative rounded-2xl p-7"
            >
              <h3 className="font-serif text-2xl text-mist">{p.title}</h3>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-muted">
                {p.body}
              </p>
              <Ignite radius="rounded-2xl" />
            </RevealItem>
          ))}
        </Reveal>

        <Reveal className="mx-auto mt-16 max-w-3xl text-center">
          <div className="luminous-line mb-10" />
          <p className="font-serif text-[clamp(1.6rem,3.2vw,2.4rem)] italic leading-snug text-glow">
            {t.resolution}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

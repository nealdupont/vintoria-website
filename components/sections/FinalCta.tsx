import type { Dictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n/config";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Reveal, RevealItem } from "@/components/ui/Reveal";

export function FinalCta({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const t = dict.cta;
  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden py-[var(--spacing-section)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full opacity-30 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(216,176,106,0.3), rgba(107,31,46,0.2), transparent 70%)",
        }}
      />
      <div className="section-x relative mx-auto max-w-3xl text-center">
        <Reveal stagger>
          <RevealItem className="flex justify-center">
            <Eyebrow>{t.eyebrow}</Eyebrow>
          </RevealItem>
          <RevealItem
            as="p"
            className="mt-7 font-serif text-[clamp(2.4rem,5.4vw,4.2rem)] leading-[1.02] tracking-[-0.02em] text-mist"
          >
            {t.heading}
          </RevealItem>
          <RevealItem
            as="p"
            className="mx-auto mt-6 max-w-md text-[1.05rem] leading-relaxed text-muted"
          >
            {t.body}
          </RevealItem>
          <RevealItem className="mt-10 flex justify-center">
            <Button href={`/${locale}/maison`} variant="solid" withArrow>
              {t.ctaPrimary}
            </Button>
          </RevealItem>
          <RevealItem
            as="p"
            className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-faint"
          >
            {t.reassurance}
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}

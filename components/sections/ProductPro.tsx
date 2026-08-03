import type { Dictionary } from "@/i18n/getDictionary";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TiltCard } from "@/components/ui/TiltCard";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { Ignite } from "@/components/ui/Ignite";

/* Aperçu d'interface Vintoria Pro — la carte intelligente */
function MockConsole() {
  const rows = [
    { dish: "Bœuf braisé", wine: "Châteauneuf-du-Pape", match: 94 },
    { dish: "Turbot rôti", wine: "Meursault", match: 92 },
    { dish: "Comté 24 mois", wine: "Vin Jaune", match: 96 },
  ];
  return (
    <div className="relative rounded-2xl border border-line bg-ink-raised/90 p-5 [transform:translateZ(40px)]">
      <div className="flex items-center justify-between border-b border-line-soft pb-3">
        <span className="text-[0.85rem] font-medium text-mist">
          Vintoria&nbsp;Pro
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-gold">
          Carte intelligente
        </span>
      </div>
      <div className="mt-4 space-y-2.5">
        {rows.map((r) => (
          <div
            key={r.dish}
            className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3.5 py-2.5"
          >
            <div className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-gold/70" />
              <span className="text-[0.82rem] text-muted">{r.dish}</span>
              <span aria-hidden className="text-faint">
                →
              </span>
              <span className="text-[0.82rem] text-mist">{r.wine}</span>
            </div>
            <span className="font-serif text-base text-glow">{r.match}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-end justify-between rounded-lg bg-white/[0.03] p-3.5 [transform:translateZ(25px)]">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
            Ventes de vin
          </div>
          <div className="mt-1 text-2xl text-glow">+18&nbsp;%</div>
        </div>
        <div className="flex h-8 items-end gap-1">
          {[40, 62, 55, 80, 94].map((h, i) => (
            <span
              key={i}
              className="w-1.5 rounded-sm bg-gold/40"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProductPro({ dict }: { dict: Dictionary }) {
  const t = dict.product;
  return (
    <section id="product" className="scroll-mt-24 py-[var(--spacing-section)]">
      <div className="section-x mx-auto max-w-6xl">
        <Reveal className="mb-14 max-w-2xl">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h2 className="mt-6 font-serif text-[clamp(2.1rem,4.6vw,3.6rem)] leading-[1.03] tracking-[-0.015em] text-mist">
            {t.heading}
          </h2>
          <p className="mt-5 text-[1.05rem] leading-relaxed text-muted">
            {t.intro}
          </p>
        </Reveal>

        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* la console, posée sur le comptoir (bois) */}
          <Reveal>
            <div className="walnut relative rounded-[1.75rem] p-6 shadow-[0_50px_100px_-50px_rgba(0,0,0,0.9)] sm:p-10">
              <TiltCard className="rounded-2xl">
                <MockConsole />
              </TiltCard>
              <Ignite radius="rounded-[1.75rem]" />
            </div>
          </Reveal>

          {/* les capacités */}
          <Reveal stagger role="list" className="flex flex-col">
            {t.features.map((f) => (
              <RevealItem
                key={f.title}
                role="listitem"
                className="group border-t border-line-soft py-5 first:border-t-0"
              >
                <div className="flex items-baseline gap-4">
                  <span
                    aria-hidden
                    className="text-gold/70 transition-transform duration-500 group-hover:translate-x-1"
                  >
                    —
                  </span>
                  <div>
                    <h3 className="text-[1.05rem] font-medium text-mist">
                      {f.title}
                    </h3>
                    <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">
                      {f.body}
                    </p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

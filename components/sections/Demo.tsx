"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Dictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n/config";
import { getDishes, getRecommendations } from "@/lib/demo/engine";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { RippleMark } from "@/components/brand/RippleMark";
import { easeRobe } from "@/lib/motion";

const STEP_MS = 380;

export function Demo({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const t = dict.demo;
  const reduce = useReducedMotion();
  const dishes = getDishes(locale);
  const [activeId, setActiveId] = useState(dishes[0].id);
  const [phase, setPhase] = useState<"thinking" | "result">("result");
  const [step, setStep] = useState(t.thinking.length);
  const recs = getRecommendations(activeId, locale);

  function pick(id: string) {
    if (id === activeId && phase === "result") return;
    setActiveId(id);
    if (reduce) {
      setPhase("result");
      return;
    }
    setStep(0);
    setPhase("thinking");
  }

  useEffect(() => {
    if (phase !== "thinking") return;
    let s = 0;
    const id = setInterval(() => {
      s += 1;
      if (s >= t.thinking.length) {
        clearInterval(id);
        setPhase("result");
      } else setStep(s);
    }, STEP_MS);
    return () => clearInterval(id);
  }, [phase, activeId, t.thinking.length]);

  return (
    <section id="demo" className="scroll-mt-24 py-[var(--spacing-section)]">
      <div className="section-x mx-auto max-w-6xl">
        <Reveal className="mb-14 max-w-2xl">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h2 className="mt-6 font-serif text-[clamp(2.1rem,4.6vw,3.6rem)] leading-[1.03] tracking-[-0.015em] text-mist">
            {t.heading}
          </h2>
          <p className="mt-5 text-[1.05rem] leading-relaxed text-muted">
            {t.subtitle}
          </p>
        </Reveal>

        <Reveal
          variants={{
            hidden: { opacity: 0, y: 32 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 1, ease: easeRobe },
            },
          }}
          className="glass overflow-hidden rounded-[1.75rem]"
        >
          <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
            <div className="border-b border-line-soft p-7 md:p-9 lg:border-b-0 lg:border-r">
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                {t.prompt}
              </span>
              <div className="mt-6 flex flex-col gap-2.5">
                {dishes.map((dish) => {
                  const active = dish.id === activeId;
                  return (
                    <button
                      key={dish.id}
                      type="button"
                      onClick={() => pick(dish.id)}
                      aria-pressed={active}
                      className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3.5 text-left transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        active
                          ? "border-gold/30 bg-white/[0.05] text-mist"
                          : "border-line-soft text-muted hover:border-line hover:text-mist"
                      }`}
                    >
                      <span className="text-[0.96rem] font-medium leading-tight">
                        {dish.label}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                        {dish.hint}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-7 flex items-start gap-2 font-mono text-[10px] leading-relaxed tracking-[0.06em] text-faint">
                <span aria-hidden className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold/60" />
                {t.disclaimer}
              </p>
            </div>

            <div className="relative min-h-[26rem] p-7 md:p-9">
              <AnimatePresence mode="wait">
                {phase === "thinking" ? (
                  <motion.div
                    key="thinking"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-0 flex flex-col justify-center gap-4 p-9"
                  >
                    <RippleMark size={38} className="mb-3" />
                    {t.thinking.map((label, i) => {
                      const done = i < step;
                      const current = i === step;
                      return (
                        <div
                          key={label}
                          className={`flex items-center gap-3 font-mono text-[12px] tracking-[0.04em] transition-colors duration-300 ${
                            done || current ? "text-mist" : "text-faint"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                              done
                                ? "bg-gold"
                                : current
                                  ? "bg-gold/70 ring-4 ring-gold/15"
                                  : "bg-faint"
                            }`}
                          />
                          {label}
                          {current && <span className="text-gold">…</span>}
                        </div>
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.div
                    key={activeId}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    variants={{
                      hidden: {},
                      visible: {
                        transition: { staggerChildren: 0.1, delayChildren: 0.05 },
                      },
                    }}
                    className="flex flex-col gap-3"
                  >
                    {recs.map((r, i) => (
                      <motion.div
                        key={r.wine}
                        variants={{
                          hidden: { opacity: 0, y: reduce ? 0 : 16 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.55, ease: easeRobe },
                          },
                        }}
                        className={`relative rounded-xl border p-5 ${
                          i === 0
                            ? "border-gold/30 bg-white/[0.04] glow-gold"
                            : "border-line-soft"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <span
                              aria-hidden
                              className="mt-1 h-7 w-7 shrink-0 rounded-full ring-1 ring-inset ring-line"
                              style={{ backgroundColor: r.colorHex }}
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-serif text-xl leading-none text-mist">
                                  {r.wine}
                                </h3>
                                <span className="rounded-full border border-line-soft px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em] text-faint">
                                  {t.fromMenu}
                                </span>
                              </div>
                              <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                                {r.appellation} · {r.vintage} · {r.grape}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-serif text-2xl text-glow leading-none">
                              {r.match}
                            </div>
                            <div className="mt-1 font-mono text-[8.5px] uppercase tracking-[0.18em] text-muted">
                              {i === 0 ? t.bestLabel : t.matchLabel}
                            </div>
                          </div>
                        </div>
                        <p className="mt-3 border-t border-line-soft pt-3 text-[0.9rem] leading-relaxed text-muted">
                          {r.why}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

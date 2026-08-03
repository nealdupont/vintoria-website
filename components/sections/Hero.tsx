"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Dictionary } from "@/i18n/getDictionary";
import { Button } from "@/components/ui/Button";
import { DropCoupe } from "@/components/brand/DropCoupe";
import { easeRobe } from "@/lib/motion";

export function Hero({ dict }: { dict: Dictionary }) {
  const t = dict.hero;
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.13, delayChildren: 0.15 } },
  };
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 22 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: easeRobe } },
  };

  return (
    <section className="vignette grain relative flex min-h-screen items-center overflow-hidden pb-24 pt-32">
      {/* lumière chaude */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[6%] top-[8%] h-[38rem] w-[38rem] rounded-full opacity-70 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(212,185,106,0.22), rgba(139,61,88,0.14), transparent 70%)",
        }}
      />
      <div className="section-x relative grid w-full items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div variants={container} initial="hidden" animate="visible">
          <motion.p
            variants={item}
            className="mb-8 inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.24em] text-muted"
          >
            <span aria-hidden className="h-px w-8 bg-gold/70" />
            {t.eyebrow}
          </motion.p>
          <h1 className="font-serif text-[clamp(2.7rem,6vw,5.2rem)] font-medium leading-[1] tracking-[-0.01em] text-mist">
            <motion.span variants={item} className="block">
              {t.titleLead}
            </motion.span>
            <motion.span variants={item} className="block text-glow italic">
              {t.titleAccent}
            </motion.span>
          </h1>
          <motion.p
            variants={item}
            className="mt-8 max-w-md text-[1.12rem] leading-relaxed text-muted"
          >
            {t.subtitle}
          </motion.p>
          <motion.div
            variants={item}
            className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
          >
            <Button href="#contact" variant="solid" withArrow>
              {t.ctaPrimary}
            </Button>
            <Button href="#demo" variant="ghost" withArrow>
              {t.ctaSecondary}
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          id="thread-origin"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.6 }}
          className="flex justify-center"
        >
          <DropCoupe className="h-[62vh] max-h-[34rem] w-full max-w-[24rem]" />
        </motion.div>
      </div>

      <motion.a
        href="#problem"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7, duration: 0.9 }}
        className="absolute inset-x-0 bottom-8 z-10 mx-auto flex w-fit items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-muted transition-colors hover:text-mist"
      >
        {t.scroll}
        <motion.span
          aria-hidden
          animate={reduce ? undefined : { y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          ↓
        </motion.span>
      </motion.a>
    </section>
  );
}

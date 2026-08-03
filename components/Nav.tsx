"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import type { Dictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n/config";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

function Wordmark({ base }: { base: string }) {
  return (
    <Link href={base} className="flex items-center gap-2.5" aria-label="Vintoria">
      <Image
        src="/vintoria-logo.png"
        alt=""
        width={26}
        height={32}
        className="h-7 w-auto"
        priority
      />
      <span className="font-serif text-xl tracking-[0.16em] text-mist">
        VINTORIA
      </span>
    </Link>
  );
}

export function Nav({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const base = `/${locale}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { href: `${base}#product`, label: dict.nav.product },
    { href: `${base}#benefits`, label: dict.nav.benefits },
    { href: `${base}#demo`, label: dict.nav.demo },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        scrolled
          ? "border-b border-[color:var(--color-line-soft)] bg-ink/80 py-3 backdrop-blur-xl"
          : "border-b border-transparent py-6"
      }`}
    >
      <nav className="section-x flex items-center justify-between">
        <Wordmark base={base} />

        <div className="hidden items-center gap-9 md:flex">
          <ul className="flex items-center gap-8 text-[0.9rem] text-muted">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="relative transition-colors duration-300 hover:text-mist after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-500 hover:after:w-full"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <span className="h-4 w-px bg-[color:var(--color-line)]" aria-hidden />
          <LanguageSwitcher locale={locale} />
          <Link
            href={`${base}#contact`}
            className="rounded-full bg-gold px-5 py-2.5 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-[#1B140F] transition-all duration-300 hover:bg-gold-strong"
          >
            {dict.nav.cta}
          </Link>
        </div>

        <button
          type="button"
          className="relative z-50 flex flex-col gap-[5px] p-1 md:hidden"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`h-px w-6 bg-mist transition-all duration-300 ${
                open && i === 0 ? "translate-y-[6px] rotate-45" : ""
              } ${open && i === 1 ? "opacity-0" : ""} ${
                open && i === 2 ? "-translate-y-[6px] -rotate-45" : ""
              }`}
            />
          ))}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="walnut fixed inset-0 top-0 z-30 flex flex-col px-6 pb-10 pt-28 md:hidden"
          >
            <ul className="flex flex-col gap-2">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.5 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-[color:var(--color-line-soft)] py-4 font-serif text-3xl text-mist"
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto flex items-center justify-between">
              <LanguageSwitcher locale={locale} />
              <Link
                href={`${base}#contact`}
                onClick={() => setOpen(false)}
                className="rounded-full bg-gold px-6 py-3 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-[#1B140F]"
              >
                {dict.nav.cta}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

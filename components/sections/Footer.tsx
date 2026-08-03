import Link from "next/link";
import type { Dictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n/config";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function Footer({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const t = dict.footer;
  const base = `/${locale}`;

  const columns = [
    {
      title: t.product,
      links: [
        { label: t.links.features, href: `${base}#product` },
        { label: t.links.demo, href: `${base}#demo` },
        { label: t.links.benefits, href: `${base}#benefits` },
      ],
    },
    {
      title: t.company,
      links: [
        { label: t.links.about, href: `${base}/maison` },
        { label: t.links.press, href: `${base}/maison` },
        { label: t.links.contact, href: `${base}#contact` },
      ],
    },
  ];

  return (
    <footer className="section-x border-t border-line-soft pb-10 pt-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-xs">
            <Link
              href={base}
              className="text-xl font-medium tracking-[0.2em] text-mist"
            >
              VINTORIA
            </Link>
            <p className="mt-5 text-[0.95rem] leading-relaxed text-muted">
              {t.tagline}
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[0.98rem] text-muted transition-colors duration-300 hover:text-mist"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col-reverse items-start justify-between gap-6 border-t border-line-soft pt-8 sm:flex-row sm:items-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
            © {new Date().getFullYear()} Vintoria. {t.rights}
          </p>
          <div className="flex items-center gap-6">
            <Link
              href={`${base}/maison`}
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint transition-colors hover:text-mist"
            >
              {t.legal}
            </Link>
            <Link
              href={`${base}/maison`}
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint transition-colors hover:text-mist"
            >
              {t.privacy}
            </Link>
            <LanguageSwitcher locale={locale} />
          </div>
        </div>
      </div>
    </footer>
  );
}

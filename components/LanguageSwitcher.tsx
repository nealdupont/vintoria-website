"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: Locale) {
    if (next === locale) return;
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000;samesite=lax`;
    const segments = pathname.split("/");
    segments[1] = next;
    router.push(segments.join("/") || `/${next}`);
  }

  const active = "text-mist";
  const dim = "text-faint hover:text-mist";

  return (
    <div
      className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em]"
      role="group"
      aria-label="Language"
    >
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1.5">
          {i > 0 && (
            <span className={dim} aria-hidden>
              /
            </span>
          )}
          <button
            type="button"
            onClick={() => switchTo(l)}
            aria-current={l === locale ? "true" : undefined}
            className={`transition-colors duration-300 ${l === locale ? active : dim}`}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}

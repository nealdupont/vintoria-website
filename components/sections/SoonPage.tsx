import type { Dictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n/config";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

export function SoonPage({
  dict,
  locale,
  title,
}: {
  dict: Dictionary;
  locale: Locale;
  title: string;
}) {
  const t = dict.soon;
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(122,32,54,0.55), transparent 70%)",
        }}
      />
      <div className="section-x relative mx-auto w-full max-w-3xl py-32 text-center">
        <div className="flex justify-center">
          <Eyebrow>{t.label}</Eyebrow>
        </div>
        <h1 className="mt-8 font-serif text-[clamp(2.6rem,6vw,4.6rem)] leading-[1.02] tracking-[-0.02em] text-mist">
          {title}
        </h1>
        <p className="mx-auto mt-6 max-w-md text-[1.05rem] leading-relaxed text-muted">
          {t.body}
        </p>
        <div className="mt-10 flex justify-center">
          <Button href={`/${locale}`} variant="outline" withArrow>
            {t.back}
          </Button>
        </div>
      </div>
    </section>
  );
}

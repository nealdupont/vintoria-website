import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Demo } from "@/components/sections/Demo";
import { Benefits } from "@/components/sections/Benefits";
import { ProductPro } from "@/components/sections/ProductPro";
import { Ecosystem } from "@/components/sections/Ecosystem";
import { FinalCta } from "@/components/sections/FinalCta";
import { SurfaceDivider } from "@/components/brand/SurfaceDivider";
import { GoldThread } from "@/components/brand/GoldThread";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l: Locale = isLocale(locale) ? locale : "fr";
  const dict = await getDictionary(l);

  return (
    <div className="relative">
      <GoldThread />
      <div className="relative z-10">
        <Hero dict={dict} />
        <Problem dict={dict} />
        <Demo dict={dict} locale={l} />
        <Benefits dict={dict} />
        <SurfaceDivider />
        <ProductPro dict={dict} />
        <Ecosystem dict={dict} />
        <FinalCta dict={dict} locale={l} />
      </div>
    </div>
  );
}

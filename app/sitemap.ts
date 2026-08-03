import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";

const BASE = "https://vintoria.com";
const routes = ["", "/produits", "/maison"];

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${BASE}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${BASE}/${l}${route}`]),
        ),
      },
    })),
  );
}

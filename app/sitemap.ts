import type { MetadataRoute } from "next";

const MODIFIE = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://vintoria.com", lastModified: MODIFIE, changeFrequency: "monthly", priority: 1 },
    {
      url: "https://vintoria.com/demonstration",
      lastModified: MODIFIE,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://vintoria.com/tarifs",
      lastModified: MODIFIE,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}

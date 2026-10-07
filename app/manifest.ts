import type { MetadataRoute } from "next";

/**
 * Le manifeste web. Icônes synchronisées depuis vintoria-brand
 * (public/marque/), couleurs du thème crème de la marque — celui de l’accueil.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vintoria",
    short_name: "Vintoria",
    description: "Le vin à sa juste place.",
    start_url: "/",
    display: "browser",
    lang: "fr",
    background_color: "#F8F1EA",
    theme_color: "#F8F1EA",
    icons: [
      { src: "/marque/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/marque/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/marque/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

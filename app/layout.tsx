import type { Metadata } from "next";
import { Spectral, Archivo } from "next/font/google";
import "./globals.css";
import { Chrome } from "@/components/Chrome";

/**
 * Deux voix, une règle : la MARQUE parle en sérif, l'INTERFACE en grotesque.
 *
 * Spectral (Production Type) — sérif taillé, lisible de 12 à 100 px. C'est la
 * voix de Vintoria : le titre, la citation, les mots du sommelier.
 * Archivo (Omnibus-Type) — grotesque neutre et précise. C'est la voix de
 * l'outil : labels, métadonnées, navigation, boutons.
 *
 * Aucun monospace : il annonce la technologie, alors que nous la voulons
 * invisible — et c'est la signature la plus datable de la décennie.
 */
const spectral = Spectral({
  variable: "--font-voix-src",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-structure-src",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vintoria.com"),
  title: "Vintoria · L’expertise du sommelier, à chaque table",
  description:
    "Un accord juste, et un repas devient un souvenir. Vintoria prolonge le sommelier dans votre salle : à chaque table, à chaque service.",
  openGraph: {
    title: "Vintoria",
    description: "L’expertise du sommelier, à chaque table.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${spectral.variable} ${archivo.variable} antialiased`}
    >
      <body className="filmgrain min-h-screen bg-encre text-os">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-os focus:px-4 focus:py-2 focus:text-sm focus:text-encre"
        >
          Aller au contenu
        </a>
        <Chrome />
        <main id="contenu">{children}</main>
      </body>
    </html>
  );
}

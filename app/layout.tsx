import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";
import { EnTete } from "@/components/site/EnTete";
import { Pied } from "@/components/site/Pied";
import { Lumieres } from "@/components/site/Lumieres";

/**
 * Les deux voix de vintoria-brand, et elles seules.
 *
 * Bodoni Moda porte la marque : titres, accords, citations. Son axe de
 * taille optique est chargé (`opsz`) : un didone dessiné pour 11 px devient
 * pâteux à 80 px, et un didone dessiné pour 80 px casse ses déliés à 16 px.
 * Avec l'axe, le navigateur choisit le bon dessin à chaque taille.
 *
 * Schibsted Grotesk porte l'information : texte courant, boutons, données.
 */
const voix = Bodoni_Moda({
  variable: "--font-voix-src",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

const structure = Schibsted_Grotesk({
  variable: "--font-structure-src",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a1020",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://vintoria.com"),
  title: {
    default: "Vintoria · Le sommelier de votre restaurant, à chaque table",
    template: "%s · Vintoria",
  },
  description:
    "Accords mets-vins à table par QR code, gestion de cave et carte des vins composée pour vous. Vintoria donne à votre restaurant l’expertise d’un sommelier. Essai gratuit, sans carte bancaire.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Vintoria · Le sommelier de votre restaurant, à chaque table",
    description:
      "Chaque table mieux conseillée. Chaque bouteille mieux valorisée. Chaque cave mieux pilotée.",
    url: "https://vintoria.com",
    siteName: "Vintoria",
    type: "website",
    locale: "fr_FR",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      /* Next 16 n'arbitre plus `scroll-behavior` entre les routes : sans cet
         attribut, passer de / à /tarifs défilerait toute la page en douceur
         au lieu d'arriver en haut. */
      data-scroll-behavior="smooth"
      className={`${voix.variable} ${structure.variable}`}
    >
      <body>
        <a href="#contenu" className="evitement">
          Aller au contenu
        </a>
        <div className="atmosphere" aria-hidden />
        <EnTete />
        <main id="contenu">{children}</main>
        <Pied />
        <Lumieres />
      </body>
    </html>
  );
}

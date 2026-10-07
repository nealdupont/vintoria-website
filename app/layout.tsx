import type { Metadata, Viewport } from "next";
import { Spectral, Archivo } from "next/font/google";
import "./globals.css";
import { Chrome } from "@/components/Chrome";
import { Pied } from "@/components/Pied";

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
 *
 * Cinq fontes, pas neuf. Chaque graisse chargée ici est employée quelque
 * part ; aucune ne dort. Le poids des polices était le premier poste de
 * la page, devant le JavaScript.
 */
const spectral = Spectral({
  variable: "--font-voix-src",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-structure-src",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

/*
 * Le fond de Vintoria va d'un bord à l'autre de l'écran.
 *
 * `viewportFit: "cover"` : sans lui, iOS Safari rétrécit le viewport de
 * mise en page pour tenir entre les zones système. La page ne PEUT pas
 * peindre derrière la barre d'état ni l'encoche, d'où le bandeau en haut.
 *
 * Le contenu, lui, reste tenu à l'écart de ces zones par env(safe-area-*).
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://vintoria.com"),
  title: {
    default: "Vintoria · L’expertise du sommelier, à chaque table",
    template: "%s · Vintoria",
  },
  description:
    "Vos clients scannent, choisissent leur plat, et découvrent les vins de votre carte expliqués comme le ferait un sommelier. Plus de ventes sur le vin, une cave tenue sans effort.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Vintoria · L’expertise du sommelier, à chaque table",
    description:
      "Le conseil d’un sommelier à chaque table, et une cave qui se tient toute seule.",
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
      /*
       * Next 16 n'écrase PLUS `scroll-behavior` pendant les navigations.
       * Sans cet attribut, passer de / à /tarifs ferait défiler la page en
       * douceur sur toute sa hauteur au lieu d'arriver en haut — à cause du
       * `scroll-behavior: smooth` que nous voulons pour les ancres internes.
       * L'attribut rend l'arbitrage à Next : saut net entre les routes,
       * défilement doux à l'intérieur d'une page.
       */
      data-scroll-behavior="smooth"
      className={`${spectral.variable} ${archivo.variable} antialiased`}
    >
      {/*
          Le fond et la couleur du corps viennent de `globals.css` (règle
          `body`, puis `body:has(.lumiere)` pour l'accueil). Les déclarer ici
          en utilitaires serait INERTE — les couches de Tailwind font gagner
          la règle CSS — et surtout trompeur : c'est la ligne qu'on
          corrigerait en croyant agir sur le noir, alors qu'il vient
          d'ailleurs. On ne garde donc que ce que cette balise gouverne
          réellement.
        */}
      <body className="filmgrain min-h-screen">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-[#1b1618] focus:px-4 focus:py-2 focus:text-sm focus:text-[#fcfaf5] focus:outline-2 focus:outline-offset-2 focus:outline-[#d4b96a]"
        >
          Aller au contenu
        </a>
        <Chrome />
        <main id="contenu">{children}</main>
        <Pied />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";
import { Chrome } from "@/components/Chrome";
import { Pied } from "@/components/Pied";

/**
 * Deux voix, une règle : la MARQUE parle en sérif, l'INTERFACE en grotesque.
 * Ce sont les deux polices du Brand System Vintoria 2026.
 *
 * Bodoni Moda — la voix de Vintoria : le titre, la citation, les mots du
 * sommelier. Fonte variable, avec l'axe de taille optique : le contraste des
 * déliés s'ajuste de 12 à 100 px.
 * Schibsted Grotesk — la voix de l'outil : labels, métadonnées, navigation,
 * boutons.
 *
 * Aucun monospace : il annonce la technologie, alors que nous la voulons
 * invisible — et c'est la signature la plus datable de la décennie.
 *
 * Deux fichiers variables, pas une graisse par fichier. Les noms hachés de
 * next/font sont rattachés aux rôles de la marque (--vintoria-police-*) dans
 * app/globals.css.
 */
const bodoni = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
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
  /* Le fond nuit de la marque : la barre du navigateur se fond dans la page. */
  themeColor: "#0F0D0E",
};

/** Décrit l'image de partage : app/opengraph-image.png (alt dans opengraph-image.alt.txt). */
const TEXTE_IMAGE_PARTAGE =
  "Logo Vintoria : le symbole V bordeaux, le nom VINTORIA et la signature « Le vin à sa juste place », sur fond crème.";

export const metadata: Metadata = {
  metadataBase: new URL("https://vintoria.com"),
  title: {
    default: "Vintoria — Le vin à sa juste place",
    template: "%s · Vintoria",
  },
  description:
    "Vos clients scannent, choisissent leur plat, et découvrent les vins de votre carte expliqués comme le ferait un sommelier. Plus de ventes sur le vin, une cave tenue sans effort.",
  alternates: { canonical: "/" },
  /*
   * Image de partage, icônes et favicon : fichiers synchronisés depuis
   * vintoria-brand (app/opengraph-image.png, icon.png, apple-icon.png,
   * favicon.ico), servis par les conventions de fichiers de Next.
   */
  openGraph: {
    title: "Vintoria — Le vin à sa juste place",
    description:
      "Le conseil d’un sommelier à chaque table, et une cave qui se tient toute seule.",
    url: "https://vintoria.com",
    siteName: "Vintoria",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vintoria — Le vin à sa juste place",
    description:
      "Le conseil d’un sommelier à chaque table, et une cave qui se tient toute seule.",
    images: [{ url: "/opengraph-image.png", alt: TEXTE_IMAGE_PARTAGE }],
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
      /* Le site est sombre : les rôles `v-*` de la marque suivent le thème nuit. */
      data-vintoria-theme="nuit"
      className={`${bodoni.variable} ${schibsted.variable} antialiased`}
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

import type { Metadata } from "next";
import { Fraunces, Schibsted_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Chrome } from "@/components/Chrome";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vintoria.com"),
  title: "Vintoria — L’expertise du sommelier, à chaque table",
  description:
    "Un accord juste, et un repas devient un souvenir. Vintoria prolonge le sommelier dans votre salle — à chaque table, à chaque service.",
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
      className={`${fraunces.variable} ${schibsted.variable} ${mono.variable} antialiased`}
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

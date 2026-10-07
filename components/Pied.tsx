import Link from "next/link";
import { LockupHorizontal } from "@/components/marque/Marque";

/**
 * LE PIED — il vit dans le layout, donc sur les trois routes.
 *
 * Il ne répète pas le site : il offre les trois sorties qui restent quand on
 * a tout lu — demander une démonstration, lire les formules, entrer dans le
 * produit. Et il redit en une ligne ce que fait Vintoria, pour le lecteur
 * arrivé par le milieu.
 *
 * IL SUIT LA LUMIÈRE SANS DEVENIR UN COMPOSANT CLIENT.
 * L'accueil se termine dans la dernière heure du jour ; finir sur une dalle noire
 * annulerait toute la traversée. Mais ce composant sert aussi /tarifs et
 * /demonstration, restées au jeu du soir, et il est rendu côté serveur :
 * il ne peut pas lire la route.
 *
 * D'où deux décisions :
 *   · il n'emploie plus que des jetons SÉMANTIQUES. Sur les routes du soir
 *     c'est un changement NUL — fond=encre, fort=os, texte=cendre et
 *     faible=cendre-2 ont exactement les mêmes valeurs que les jetons
 *     bruts qu'il employait ;
 *   · c'est la feuille de style qui le fait basculer, via
 *     `body:has(.lumiere) footer`. Le pied est le DERNIER élément du
 *     document : l'enveloppe est déjà analysée quand il se peint, donc
 *     aucun clignotement — là où l'en-tête, lui, réclamait une classe
 *     explicite parce qu'il se peint AVANT elle.
 */
export function Pied() {
  const annee = new Date().getFullYear();

  return (
    <footer className="px relative border-t border-filet bg-fond pb-[calc(3rem_+_env(safe-area-inset-bottom))] pt-20">
      {/* La dernière lumière du jour. Invisible hors de l'accueil. */}
      <div aria-hidden className="lueur-pied" />

      <div className="relative z-10 mx-auto max-w-[1180px]">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {/*
              Le lockup horizontal de la marque, en composition officielle
              (components/marque/Marque.tsx). Le pied ne connaît pas la
              route : les deux variantes sont posées, la feuille de style
              montre `fonce` sur les routes du soir et `clair` sur l'accueil
              (voir `.logo-clair` dans app/globals.css). Les images cachées
              sont paresseuses : la variante masquée n'est jamais chargée.
            */}
            <LockupHorizontal hauteur={36} variante="fonce" className="logo-fonce" />
            <LockupHorizontal hauteur={36} variante="clair" className="logo-clair" />
            <p className="t-meta mt-3 max-w-[34ch] text-faible">
              Le vin à sa juste place.
            </p>
          </div>

          <nav aria-label="Pied de page">
            <ul className="flex flex-col gap-3 sm:text-right">
              <li>
                <Link
                  href="/demonstration"
                  className="t-corps inline-flex min-h-11 items-center text-texte transition-colors duration-300 hover:text-fort"
                >
                  Demander une démonstration
                </Link>
              </li>
              <li>
                <Link
                  href="/tarifs"
                  className="t-corps inline-flex min-h-11 items-center text-texte transition-colors duration-300 hover:text-fort"
                >
                  Les formules
                </Link>
              </li>
              <li>
                <a
                  href="https://www.vintoria.app"
                  className="t-corps inline-flex min-h-11 items-center text-texte transition-colors duration-300 hover:text-fort"
                >
                  Accéder à Vintoria
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@vintoria.com"
                  className="t-corps inline-flex min-h-11 items-center text-texte transition-colors duration-300 hover:text-fort"
                >
                  contact@vintoria.com
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <p className="t-meta mt-14 border-t border-filet pt-6 text-faible">
          © {annee} Vintoria
        </p>
      </div>
    </footer>
  );
}

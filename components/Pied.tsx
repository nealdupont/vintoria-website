import Image from "next/image";
import Link from "next/link";

/**
 * LE PIED — il vit dans le layout, donc sur les trois routes.
 *
 * Il ne répète pas le site : il offre les trois sorties qui restent quand on
 * a tout lu — demander une démonstration, lire les formules, entrer dans le
 * produit. Et il redit en une ligne ce que fait Vintoria, pour le lecteur
 * arrivé par le milieu.
 */
export function Pied() {
  const annee = new Date().getFullYear();

  return (
    <footer className="px border-t border-filet bg-nuit pb-[calc(3rem_+_env(safe-area-inset-bottom))] pt-16">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {/* Le lockup horizontal de la marque, variante `fonce`. */}
            <Image
              src="/marque/lockup-horizontal-fonce.svg"
              alt="Vintoria"
              width={1606}
              height={400}
              className="h-9 w-auto"
            />
            <p className="t-meta mt-3 max-w-[34ch] text-cendre-2">
              Le vin à sa juste place.
            </p>
          </div>

          <nav aria-label="Pied de page">
            <ul className="flex flex-col gap-3 sm:text-right">
              <li>
                <Link
                  href="/demonstration"
                  className="t-corps inline-flex min-h-11 items-center text-cendre transition-colors duration-300 hover:text-os"
                >
                  Demander une démonstration
                </Link>
              </li>
              <li>
                <Link
                  href="/tarifs"
                  className="t-corps inline-flex min-h-11 items-center text-cendre transition-colors duration-300 hover:text-os"
                >
                  Les formules
                </Link>
              </li>
              <li>
                <a
                  href="https://www.vintoria.app"
                  className="t-corps inline-flex min-h-11 items-center text-cendre transition-colors duration-300 hover:text-os"
                >
                  Accéder à Vintoria
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@vintoria.com"
                  className="t-corps inline-flex min-h-11 items-center text-cendre transition-colors duration-300 hover:text-os"
                >
                  contact@vintoria.com
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <p className="t-meta mt-14 border-t border-filet pt-6 text-cendre-2">
          © {annee} Vintoria
        </p>
      </div>
    </footer>
  );
}

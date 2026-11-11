import Link from "next/link";
import { Lockup, Wordmark } from "@/components/marque/Marque";
import { CONNEXION, COURRIEL_CONTACT, INSCRIPTION } from "@/lib/liens";

/**
 * LE PIED. Il redit en une phrase ce que fait Vintoria, pour qui arrive par
 * le bas, et rouvre les trois portes : essayer, se connecter, nous écrire.
 */
export function Pied() {
  const annee = new Date().getFullYear();

  return (
    <footer className="pied">
      <div className="conteneur">
        <div className="pied-haut">
          <div className="pied-marque">
            <Lockup hauteur={34} />
            <p>Le conseil d’un sommelier à chaque table, et une cave qui se tient toute seule.</p>
          </div>

          <nav aria-labelledby="pied-produit">
            <h2 id="pied-produit">Vintoria</h2>
            <ul>
              <li>
                <Link href="/#fonctionnalites">Fonctionnalités</Link>
              </li>
              <li>
                <Link href="/#benefices">Bénéfices</Link>
              </li>
              <li>
                <Link href="/tarifs">Formules</Link>
              </li>
              <li>
                <Link href="/#questions">Questions</Link>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="pied-commencer">
            <h2 id="pied-commencer">Commencer</h2>
            <ul>
              <li>
                <a href={INSCRIPTION}>Essai gratuit</a>
              </li>
              <li>
                <a href={CONNEXION}>Se connecter</a>
              </li>
              <li>
                <Link href="/demonstration">Demander une démonstration</Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2>Nous écrire</h2>
            <ul>
              <li>
                <a href={`mailto:${COURRIEL_CONTACT}`}>{COURRIEL_CONTACT}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pied-signature" aria-hidden>
          <Wordmark hauteur={100} />
        </div>

        <div className="pied-bas">
          <p>© {annee} Vintoria</p>
          <p>Conçu par un sommelier, pour les restaurateurs.</p>
        </div>
      </div>
    </footer>
  );
}

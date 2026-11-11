import Link from "next/link";
import { CartesFormules } from "@/components/site/Formules";

/**
 * VII · LES FORMULES. Après les bénéfices, jamais avant : un tarif lu
 * avant d'avoir vu ce qu'il achète n'est qu'un chiffre. Et l'essai
 * gratuit est rappelé avant tout, parce que c'est la vraie décision
 * demandée ici.
 */
export function Formules() {
  return (
    <section id="formules" className="section" aria-labelledby="formules-titre">
      <div className="conteneur">
        <div className="formules-tete">
          <h2 id="formules-titre" className="t-l" data-revele="titre">
            Commencez gratuitement. Choisissez ensuite.
          </h2>
          <p className="chapeau">
            Le conseil à table est compris dans les trois formules. Ce qui
            change, c’est ce que Vintoria fait de votre cave autour, et le
            nombre d’adresses.
          </p>
        </div>

        <CartesFormules limite={6} />

        <div className="formules-note">
          <p className="petit">
            L’essai est gratuit et ne demande aucune carte bancaire : rien ne
            peut vous être facturé par surprise.
          </p>
          <Link className="lien lien-seul petit" href="/tarifs">
            Comparer les formules en détail
          </Link>
        </div>
      </div>
    </section>
  );
}

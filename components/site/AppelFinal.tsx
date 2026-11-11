import Link from "next/link";
import { INSCRIPTION } from "@/lib/liens";
import { Voute } from "@/components/accueil/Illustrations";
import { Liquide } from "@/components/accueil/Liquide";

/**
 * IX · L'APPEL : une voûte de cave, pleine de vin.
 *
 * La page s'ouvrait sur du vin derrière un rideau ; elle se referme sur le
 * même vin, vu par l'arche d'une cave. Les arcs de la voûte l'entourent,
 * cerclés d'or, et la dernière phrase se lit au cœur de la lumière. Une
 * seule porte, au centre : l'essai gratuit.
 *
 * Le vin est le même nuanceur que l'ouverture, centré dans la fenêtre ; il
 * ne tourne que lorsque l'arche est à l'écran.
 */
export function AppelFinal({
  titre = "Ce soir, chaque table peut avoir son sommelier.",
}: {
  titre?: string;
}) {
  return (
    <section className="section appel" aria-labelledby="appel-titre">
      <div className="conteneur">
        <div className="appel-arche" data-revele>
          <Voute className="appel-voute" />
          <div className="appel-fenetre" aria-hidden>
            <Liquide className="appel-liquide" foyer="centre" />
            <div className="appel-voile" />
          </div>
          <div className="appel-contenu">
            <h2 id="appel-titre" className="t-l">
              {titre}
            </h2>
            <p className="chapeau">
              Créez votre espace, importez votre carte, et voyez les accords
              que Vintoria propose pour vos plats.
            </p>
            <div className="appel-actions">
              <a className="bouton bouton-or bouton-large" href={INSCRIPTION}>
                Commencer l’essai gratuit
              </a>
              <Link className="bouton bouton-verre bouton-large" href="/demonstration">
                Demander une démonstration
              </Link>
            </div>
            <p className="petit">Essai gratuit, aucune carte bancaire requise.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

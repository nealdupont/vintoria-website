import Link from "next/link";
import { COURRIEL_CONTACT } from "@/lib/liens";

/**
 * VIII · LES QUESTIONS. Celles qu'un restaurateur pose avant de s'inscrire,
 * dans l'ordre où il se les pose. Chaque réponse ne dit que ce que le
 * produit fait déjà : une promesse ici serait une promesse au contrat.
 *
 * <details> natif : ouvert au clavier, lu par les lecteurs d'écran, et
 * aucun JavaScript.
 */

export type Question = { q: string; r: string };

export const QUESTIONS_ACCUEIL: Question[] = [
  {
    q: "Mes clients doivent-ils télécharger une application ?",
    r: "Non. Ils scannent le QR code posé sur la table et la page s’ouvre dans leur navigateur. Pas d’application à installer, pas de compte à créer.",
  },
  {
    q: "Je ne suis pas sommelier. Est-ce fait pour moi ?",
    r: "C’est précisément pour vous. Vintoria choisit les accords dans votre cave et explique chacun en mots simples, à votre client comme à votre équipe. Vous n’avez rien à rédiger.",
  },
  {
    q: "Combien de temps faut-il pour démarrer ?",
    r: "Vous importez votre carte des vins (PDF, photo ou texte), vous ajoutez vos plats, vous imprimez le QR code. Le plus long reste de choisir où le poser sur la table.",
  },
  {
    q: "Vintoria peut-il conseiller un vin que je n’ai plus ?",
    r: "Vintoria ne conseille que des vins de votre carte. Avec la gestion de cave, une bouteille épuisée sort d’elle-même des accords, et vous êtes prévenu avant la rupture.",
  },
  {
    q: "Puis-je mettre en avant certaines bouteilles ?",
    r: "Oui. Vous indiquez les vins que vous souhaitez voir partir, et ils remontent dans les accords quand ils conviennent au plat.",
  },
  {
    q: "Que se passe-t-il à la fin de l’essai ?",
    r: "Vous choisissez la formule qui vous convient. Aucune carte bancaire n’est demandée pour l’essai : rien ne peut vous être facturé sans votre accord.",
  },
  {
    q: "J’ai plusieurs établissements. Comment faire ?",
    r: "La formule Enterprise réunit jusqu’à cinq établissements, avec des rôles distincts pour votre équipe et l’accès aux intégrations. Parlons-en ensemble.",
  },
];

export function Questions({
  questions = QUESTIONS_ACCUEIL,
  titre = "Vos questions.",
}: {
  questions?: Question[];
  titre?: string;
}) {
  return (
    <section id="questions" className="section" aria-labelledby="faq-titre">
      <div className="conteneur faq">
        <div className="faq-tete">
          <h2 id="faq-titre" className="t-l" data-revele="titre">
            {titre}
          </h2>
          <div className="verre faq-contact" data-lumiere>
            <p className="corps">
              Une autre question ? Écrivez-nous à{" "}
              <a className="lien" href={`mailto:${COURRIEL_CONTACT}`}>
                {COURRIEL_CONTACT}
              </a>
              , ou voyons-la ensemble sur votre carte.
            </p>
            <Link className="bouton bouton-verre bouton-petit" href="/demonstration">
              Demander une démonstration
            </Link>
          </div>
        </div>

        <div className="faq-liste">
          {questions.map((x) => (
            <details key={x.q}>
              <summary>
                <span>{x.q}</span>
                <span className="faq-signe" aria-hidden />
              </summary>
              <p className="corps faq-reponse">{x.r}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

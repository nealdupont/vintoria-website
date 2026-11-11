"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { demanderDemonstration } from "@/app/demonstration/action";
import { ETAT_INITIAL, type Champ, type EtatDemande } from "@/app/demonstration/etat";
import { COURRIEL_CONTACT } from "@/lib/liens";

/* ------------------------------------------------------------------ */

interface ChampProps {
  nom: Champ | "message";
  etiquette: string;
  type?: "text" | "email" | "tel" | "number";
  requis?: boolean;
  aide?: string;
  zone?: boolean;
  autoComplete?: string;
  inputMode?: "numeric" | "tel" | "email";
  erreur?: string;
  valeur?: string;
}

/**
 * Un champ = une étiquette VISIBLE, un contrôle, et au besoin une aide ou
 * une erreur. Le placeholder ne remplace jamais l'étiquette : il disparaît
 * à la saisie, et avec lui la seule indication de ce qu'on remplissait.
 */
function ChampSaisi({
  nom,
  etiquette,
  type = "text",
  requis = false,
  aide,
  zone = false,
  autoComplete,
  inputMode,
  erreur,
  valeur,
}: ChampProps) {
  const id = useId();
  const idAide = `${id}-aide`;
  const idErreur = `${id}-erreur`;
  const decrit = [aide ? idAide : null, erreur ? idErreur : null].filter(Boolean).join(" ");

  const commun = {
    id,
    name: nom,
    defaultValue: valeur,
    required: requis,
    autoComplete,
    inputMode,
    "aria-invalid": erreur ? (true as const) : undefined,
    "aria-describedby": decrit || undefined,
  };

  return (
    <p className="champ">
      <label htmlFor={id}>
        {etiquette}
        {requis ? (
          <span className="champ-requis" aria-hidden>
            *
          </span>
        ) : (
          <span className="champ-facultatif">facultatif</span>
        )}
      </label>

      {zone ? <textarea {...commun} rows={4} /> : <input {...commun} type={type} />}

      {aide ? (
        <span id={idAide} className="champ-aide">
          {aide}
        </span>
      ) : null}
      {erreur ? (
        <span id={idErreur} className="champ-erreur">
          {erreur}
        </span>
      ) : null}
    </p>
  );
}

/* ------------------------------------------------------------------ */

function Merci({ etablissement }: { etablissement: string }) {
  return (
    <div className="merci" role="status" aria-live="polite">
      <p className="chapitre">Demande reçue</p>
      <p className="t-m" style={{ marginTop: "1rem" }}>
        Nous revenons vers {etablissement} sous 24 heures.
      </p>
      <p className="corps">
        D’ici là, vous pouvez nous envoyer votre carte des vins. Nous la chargeons
        avant l’appel, pour que la démonstration se fasse sur vos vins et non sur
        les nôtres.
      </p>
      <p className="petit">
        <a className="lien" href={`mailto:${COURRIEL_CONTACT}`}>
          {COURRIEL_CONTACT}
        </a>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function FormulaireDemonstration() {
  const [etat, action, enCours] = useActionState<EtatDemande, FormData>(
    demanderDemonstration,
    ETAT_INITIAL,
  );
  const formulaire = useRef<HTMLFormElement>(null);
  const resume = useRef<HTMLParagraphElement>(null);

  /*
   * L'horodatage d'ouverture alimente le piège de cadence côté serveur.
   * Il est posé après l'hydratation : un robot qui lit le HTML brut ne le
   * trouve pas, et le formulaire reste valide sans JavaScript.
   */
  const ouverture = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ouverture.current) ouverture.current.value = String(Date.now());
  }, []);

  /*
   * Après une erreur, le curseur va au premier champ fautif. Sans cela,
   * sur un formulaire long, l'utilisateur lit « 2 champs à corriger » et
   * doit les chercher lui-même.
   */
  useEffect(() => {
    if (etat.phase !== "erreur") return;
    const premier = Object.keys(etat.champs)[0];
    const cible = premier
      ? formulaire.current?.querySelector<HTMLElement>(`[name="${premier}"]`)
      : resume.current;
    cible?.focus();
  }, [etat]);

  if (etat.phase === "envoye") return <Merci etablissement={etat.etablissement} />;

  const erreurs = etat.phase === "erreur" ? etat.champs : {};
  const valeurs = etat.phase === "erreur" ? etat.valeurs : {};

  return (
    <form ref={formulaire} action={action} noValidate className="form">
      {/* Le leurre reste HORS-CADRE et non masqué : un `display:none` est le
          premier signal qu'un robot un peu sérieux apprend à ignorer. Il est
          `aria-hidden` et hors tabulation, donc invisible à tout humain,
          lecteur d'écran compris. */}
      <div aria-hidden className="leurre">
        <label htmlFor="mot">Ne remplissez pas ce champ</label>
        <input id="mot" name="mot" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input ref={ouverture} type="hidden" name="ouverture" defaultValue="" />

      <div className="form-grille">
        <ChampSaisi
          nom="etablissement"
          etiquette="Établissement"
          requis
          autoComplete="organization"
          erreur={erreurs.etablissement}
          valeur={valeurs.etablissement}
        />
        <ChampSaisi
          nom="ville"
          etiquette="Ville"
          autoComplete="address-level2"
          erreur={erreurs.ville}
          valeur={valeurs.ville}
        />
        <ChampSaisi
          nom="nom"
          etiquette="Votre nom"
          requis
          autoComplete="name"
          erreur={erreurs.nom}
          valeur={valeurs.nom}
        />
        <ChampSaisi
          nom="courriel"
          etiquette="E-mail"
          type="email"
          requis
          autoComplete="email"
          inputMode="email"
          erreur={erreurs.courriel}
          valeur={valeurs.courriel}
        />
        <ChampSaisi
          nom="telephone"
          etiquette="Téléphone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          erreur={erreurs.telephone}
          valeur={valeurs.telephone}
        />
        <ChampSaisi
          nom="couverts"
          etiquette="Couverts par service"
          type="number"
          inputMode="numeric"
          aide="Pour calibrer la démonstration."
          erreur={erreurs.couverts}
          valeur={valeurs.couverts}
        />
        <ChampSaisi
          nom="references"
          etiquette="Références à la carte"
          type="number"
          inputMode="numeric"
          aide="Une estimation suffit."
          erreur={erreurs.references}
          valeur={valeurs.references}
        />
      </div>

      <ChampSaisi nom="message" etiquette="Un mot sur votre carte" zone />

      {/*
        Le résumé d'erreur est annoncé par `aria-live` ET recevra le focus
        si l'échec ne vient d'aucun champ en particulier (envoi impossible).
      */}
      <p
        ref={resume}
        tabIndex={-1}
        aria-live="polite"
        className={etat.phase === "erreur" ? "form-erreur" : "sr-only"}
      >
        {etat.phase === "erreur" ? etat.message : ""}
      </p>

      <div className="form-pied">
        <button type="submit" className="bouton bouton-or" disabled={enCours}>
          {enCours ? "Envoi…" : "Demander la démonstration"}
        </button>
        <span className="petit">Réponse sous 24 h, sans engagement</span>
      </div>
    </form>
  );
}

"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { demanderDemonstration } from "@/app/demonstration/action";
import { ETAT_INITIAL, type Champ, type EtatDemande } from "@/app/demonstration/etat";

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
function Champ({
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
    className: [
      "w-full rounded-xl border bg-transparent px-4 text-fort",
      "placeholder:text-faible/70",
      "transition-colors duration-[120ms]",
      erreur ? "border-erreur" : "border-filet hover:border-filet-fort",
      zone ? "min-h-[7rem] py-3 leading-relaxed" : "min-h-[48px] py-3",
    ].join(" "),
  };

  return (
    <p className="flex flex-col gap-2">
      <label htmlFor={id} className="t-meta font-medium text-texte">
        {etiquette}
        {requis ? (
          <span className="ml-1 text-accent" aria-hidden>
            *
          </span>
        ) : (
          <span className="ml-2 text-faible">facultatif</span>
        )}
      </label>

      {zone ? <textarea {...commun} rows={4} /> : <input {...commun} type={type} />}

      {aide ? (
        <span id={idAide} className="t-meta text-faible">
          {aide}
        </span>
      ) : null}
      {erreur ? (
        <span id={idErreur} className="t-meta text-erreur">
          {erreur}
        </span>
      ) : null}
    </p>
  );
}

/* ------------------------------------------------------------------ */

function Merci({ etablissement }: { etablissement: string }) {
  return (
    <div
      className="rounded-2xl border border-filet-fort p-8 sm:p-10"
      role="status"
      aria-live="polite"
    >
      <p className="eyebrow mb-4">Demande reçue</p>
      <p className="voix t-citation text-fort">
        Nous revenons vers {etablissement} sous 24 heures.
      </p>
      <p className="t-corps mt-5 max-w-prose text-texte">
        D’ici là, vous pouvez nous envoyer votre carte des vins — nous la chargeons
        avant l’appel, pour que la démonstration se fasse sur vos vins et non sur
        les nôtres.
      </p>
      <p className="t-meta mt-6 text-faible">
        <a className="underline underline-offset-4 hover:text-accent" href="mailto:contact@vintoria.com">
          contact@vintoria.com
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
    <form ref={formulaire} action={action} noValidate className="flex flex-col gap-6">
      {/* Le leurre : hors tabulation, hors arbre d'accessibilité. */}
      {/* Le leurre reste HORS-CADRE et non masqué : un `display:none` est le
          premier signal qu'un robot un peu sérieux apprend à ignorer. Il est
          `aria-hidden` et hors tabulation, donc invisible à tout humain,
          lecteur d'écran compris. */}
      <div aria-hidden className="absolute left-[-9999px] top-0 h-px w-px overflow-hidden">
        <label htmlFor="mot">Ne remplissez pas ce champ</label>
        <input id="mot" name="mot" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input ref={ouverture} type="hidden" name="ouverture" defaultValue="" />

      <div className="grid gap-6 sm:grid-cols-2">
        <Champ
          nom="etablissement"
          etiquette="Établissement"
          requis
          autoComplete="organization"
          erreur={erreurs.etablissement}
          valeur={valeurs.etablissement}
        />
        <Champ
          nom="ville"
          etiquette="Ville"
          autoComplete="address-level2"
          erreur={erreurs.ville}
          valeur={valeurs.ville}
        />
        <Champ
          nom="nom"
          etiquette="Votre nom"
          requis
          autoComplete="name"
          erreur={erreurs.nom}
          valeur={valeurs.nom}
        />
        <Champ
          nom="courriel"
          etiquette="E-mail"
          type="email"
          requis
          autoComplete="email"
          inputMode="email"
          erreur={erreurs.courriel}
          valeur={valeurs.courriel}
        />
        <Champ
          nom="telephone"
          etiquette="Téléphone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          erreur={erreurs.telephone}
          valeur={valeurs.telephone}
        />
        <Champ
          nom="couverts"
          etiquette="Couverts par service"
          type="number"
          inputMode="numeric"
          aide="Pour calibrer la démonstration."
          erreur={erreurs.couverts}
          valeur={valeurs.couverts}
        />
        <Champ
          nom="references"
          etiquette="Références à la carte"
          type="number"
          inputMode="numeric"
          aide="Une estimation suffit."
          erreur={erreurs.references}
          valeur={valeurs.references}
        />
      </div>

      <Champ nom="message" etiquette="Un mot sur votre carte" zone />

      {/*
        Le résumé d'erreur est annoncé par `aria-live` ET recevra le focus
        si l'échec ne vient d'aucun champ en particulier (envoi impossible).
      */}
      <p
        ref={resume}
        tabIndex={-1}
        aria-live="polite"
        className={`t-meta ${etat.phase === "erreur" ? "text-erreur" : "sr-only"}`}
      >
        {etat.phase === "erreur" ? etat.message : ""}
      </p>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
        <button type="submit" className="bouton bouton-primaire" disabled={enCours}>
          {enCours ? "Envoi…" : "Demander la démonstration"}
        </button>
        <span className="t-meta text-faible">
          Réponse sous 24 h · sans engagement
        </span>
      </div>
    </form>
  );
}

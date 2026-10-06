"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import s from "./Film.module.css";
import { BOUCLE, PHRASES, RECIT } from "./scenario";

/**
 * LA DÉMONSTRATION — trente-deux secondes, sept séquences.
 *
 * MOTEUR : une seule animation CSS de 32 s, partagée ; chaque élément s'y
 * place par ses pourcentages, `animation-play-state` est l'unique
 * interrupteur. Aucune image n'est calculée en JavaScript. Motion.dev ne sert
 * que le bouton.
 *
 * CE QUI A CHANGÉ DEPUIS LA VERSION PRÉCÉDENTE : le produit.
 * Vintoria Pro est passé d'un back-office presque noir, à texture de bois, à
 * une interface CLAIRE — crème et bordeaux. Les captures ont donc toutes été
 * reprises sur la version actuelle (v2.0.2).
 *
 * Et avec elles, la mise en scène : l'ancienne interface étant illisible, la
 * version précédente la recouvrait de cartes reconstruites. La nouvelle se lit
 * d'elle-même, donc la caméra entre DEDANS plutôt que de poser des calques
 * par-dessus. On regarde le produit, pas ma reconstitution.
 *
 * Il ne reste qu'un seul calque : la ligne de mouvement de stock, parce
 * qu'elle doit MONTRER un chiffre qui change, ce qu'une capture ne peut pas
 * faire.
 */

const DUREE_MS = 32_000;

const MQ = "(prefers-reduced-motion: reduce)";
function sAbonnerMouvement(signaler: () => void) {
  const mq = window.matchMedia(MQ);
  mq.addEventListener("change", signaler);
  return () => mq.removeEventListener("change", signaler);
}
const lireMouvement = () => window.matchMedia(MQ).matches;
const sansAbonnement = () => () => {};
const lireEconomie = () =>
  Boolean(
    (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData,
  );
const auServeur = () => false;

const RESSORT = { type: "spring", stiffness: 380, damping: 26, mass: 0.9 } as const;

/** Une capture du produit, posée comme un objet dans l'espace. */
function Ecran({
  src,
  classe,
  largeur = 1500,
  hauteur = 940,
  tailles = "(min-width: 1024px) 1150px, 100vw",
}: {
  src: string;
  classe: string;
  largeur?: number;
  hauteur?: number;
  tailles?: string;
}) {
  return (
    <div data-anim className={`${s.ecran} ${classe}`}>
      <Image src={src} alt="" width={largeur} height={hauteur} sizes={tailles} loading="lazy" />
    </div>
  );
}

export function Film() {
  const racine = useRef<HTMLDivElement>(null);
  const [joue, setJoue] = useState(false);
  const [fini, setFini] = useState(false);
  const [cle, setCle] = useState(0);

  const reduit = useSyncExternalStore(sAbonnerMouvement, lireMouvement, auServeur);
  const economie = useSyncExternalStore(sansAbonnement, lireEconomie, auServeur);
  const statique = reduit || economie;

  useEffect(() => {
    if (statique || joue) return;
    const el = racine.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setJoue(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [statique, joue]);

  useEffect(() => {
    if (!joue) return;
    const t = setTimeout(() => setFini(true), DUREE_MS);
    return () => clearTimeout(t);
  }, [joue, cle]);

  const revoir = useCallback(() => {
    setFini(false);
    setJoue(false);
    setCle((k) => k + 1);
    requestAnimationFrame(() => setJoue(true));
  }, []);

  const libelle = fini
    ? "Revoir la démonstration"
    : joue
      ? "Démonstration en cours"
      : "Voir la démonstration";

  return (
    <figure className="m-0">
      <div
        ref={racine}
        className={[s.film, joue && !statique ? s.joue : "", statique ? s.statique : ""]
          .filter(Boolean)
          .join(" ")}
      >
        <div className={s.scene} key={cle} aria-hidden>
          {/* ── 01 · LA CARTE — l'Atelier, écran « Carte » puis l'ajout ─ */}
          <Ecran src="/demo/carte.webp" classe={s.planCarte} />
          <Ecran src="/demo/ajouter.webp" classe={s.planAjouter} />

          {/* ── 02 · LA CAVE — 179 bouteilles, la composition ────────── */}
          <Ecran src="/demo/cave.webp" classe={s.planCave} />

          {/* ── 03 · LE RÉASSORT — le produit le dit lui-même ────────── */}
          <Ecran src="/demo/aujourdhui.webp" classe={s.planAujourdhui} />

          {/* ── 04 · L'INVENTAIRE — le PDF réel, généré en 2.0.2 ─────── */}
          <Ecran
            src="/demo/pdf.webp"
            classe={s.planPdf}
            largeur={900}
            hauteur={636}
            tailles="(min-width: 1024px) 560px, 76vw"
          />

          {/* ── 05 · LE CLIENT — le soir, l'écran redevient sombre ───── */}
          <Ecran
            src="/demo/plats.webp"
            classe={`${s.tel} ${s.telPlats}`}
            largeur={720}
            hauteur={1558}
            tailles="(min-width: 1024px) 220px, 34vw"
          />
          <Ecran
            src="/demo/couleur.webp"
            classe={`${s.tel} ${s.telCouleur}`}
            largeur={720}
            hauteur={1558}
            tailles="(min-width: 1024px) 220px, 34vw"
          />
          <Ecran
            src="/demo/resultat.webp"
            classe={`${s.tel} ${s.telResultat}`}
            largeur={720}
            hauteur={1558}
            tailles="(min-width: 1024px) 300px, 46vw"
          />

          {/* ── 06 · LA BOUCLE ──────────────────────────────────────── */}
          <div data-anim className={s.boucle}>
            {BOUCLE.map((m, i) => (
              <span data-anim key={m} className={`${s.maillon} ${s[`m${i + 1}`]}`}>
                {m}
              </span>
            ))}
          </div>

          {/* ── 07 · VINTORIA ───────────────────────────────────────── */}
          {/* Le wordmark officiel, en tracés : jamais recomposé en texte. La
              scène est aria-hidden, le récit dit déjà « Vintoria ». */}
          <p data-anim className={s.marque}>
            <Image src="/marque/wordmark-creme.svg" alt="" width={1059} height={102} />
          </p>
          <p data-anim className={s.signature}>
            Le vin à sa juste place.
          </p>

        </div>

        {/*
          LE VOILE ET LES PHRASES VIVENT HORS DE LA SCÈNE.

          Dans le volume 3D ils se trouvaient à z = 0, et tout plan poussé
          vers la caméra passait DEVANT eux : à 8 s, l'écran des stocks
          recouvrait sa propre légende. Ils appartiennent au cadre, pas à
          l'espace — ils sont donc frères de `.scene`, pas ses enfants.
        */}
        <div className={s.vignette} />

        <div className={s.phrases}>
          {PHRASES.map((p, i) => (
            <p data-anim key={p} className={`${s.phrase} ${s[`phrase${i + 1}`]}`}>
              {p}
            </p>
          ))}
        </div>
      </div>

      <figcaption className="sr-only">{RECIT}</figcaption>

      {!statique && (
        <p className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center">
          <motion.button
            type="button"
            onClick={revoir}
            disabled={joue && !fini}
            whileHover={joue && !fini ? undefined : { y: -2 }}
            whileTap={joue && !fini ? undefined : { y: 0, scale: 0.97 }}
            transition={RESSORT}
            className="eyebrow inline-flex min-h-11 items-center transition-colors duration-300 hover:text-os disabled:opacity-45"
          >
            {libelle}
          </motion.button>
          <span className="t-meta text-faible">
            Captures de Vintoria Pro 2.0.2 · établissement de démonstration
          </span>
        </p>
      )}
    </figure>
  );
}

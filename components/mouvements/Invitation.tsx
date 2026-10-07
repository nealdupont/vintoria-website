import Link from "next/link";

/**
 * L'INVITATION — le dernier mouvement.
 *
 * L'origine y est rattachée, condensée. Elle vivait dans un acte autonome,
 * placé avant l'appel à l'action : savoir qui est derrière Vintoria rassure
 * au moment de DÉCIDER, pas dix minutes avant. Un seul argument de confiance,
 * juste sous le bouton, vaut mieux qu'une page entière à distance.
 *
 * Un seul appel à l'action principal sur tout ce mouvement, et il mène à une
 * vraie page, plus à un client mail.
 *
 * Composant SERVEUR.
 */

export function Invitation() {
  return (
    <section id="invitation" className="px rythme-ample relative overflow-hidden">
      <div
        aria-hidden
        className="robe-trace pointer-events-none absolute inset-x-0 bottom-[-30%] mx-auto h-[70vh] w-[70vh] rounded-full"
        style={{ "--trace-force": 0.12, "--trace-retard": "400ms" } as React.CSSProperties}
      />

      <div className="relative z-10 mx-auto max-w-[1180px]">
        <p className="eyebrow mb-7">L’invitation</p>

        <h2 className="voix t-display max-w-[16ch] text-balance text-fort">
          Faites entrer un sommelier à chaque table.
        </h2>

        <div className="mt-12 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <Link href="/demonstration" className="bouton bouton-primaire group">
            Demander une démonstration
            <span
              aria-hidden
              className="transition-transform duration-500 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
          <Link href="/tarifs" className="bouton bouton-fantome">
            Voir les formules
          </Link>
        </div>

        <p className="t-meta mt-5 text-faible">
          Vingt minutes, sur votre carte · réponse sous 24 h · sans engagement
        </p>

        {/* ── L'origine, au moment de décider ─────────────────────────── */}
        <div className="parait mt-16 grid gap-10 border-t border-filet pt-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-20">
          <blockquote>
            <p className="voix t-citation text-balance italic text-fort">
              « Le vin n’est pas compliqué. On l’a compliqué. Le savoir existe. Il
              est resté dans quelques têtes, au lieu d’arriver jusqu’à la table. »
            </p>
          </blockquote>

          <div className="self-end">
            <p className="t-corps max-w-[46ch] text-texte">
              Vintoria n’est pas né dans un laboratoire, mais derrière le passe.
              D’une conviction simple, apprise en des milliers de services : ce
              savoir ne nous appartient pas. Il nous a été confié, et notre métier
              est de le rendre.
            </p>
            <p className="mt-6 border-t border-filet pt-5">
              <span className="eyebrow block text-fort">Neal Dupont</span>
              <span className="t-meta mt-1.5 block text-faible">
                Sommelier savoyard · dix ans en restaurants gastronomiques étoilés,
                en France et à l’international
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

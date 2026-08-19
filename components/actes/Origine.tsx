import { Line } from "@/components/Line";

/**
 * ACTE V — L’ORIGINE.
 * Objection levée : « Puis-je leur faire confiance ? »
 * Traitement : respiration. Beaucoup de vide, une voix à la première personne.
 */
export function Origine() {
  return (
    <section id="origine" className="px rythme-ample relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[52vh] w-[52vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(circle, rgba(110,16,35,0.16), transparent 66%)",
        }}
      />

      {/* La trace du vin retenu — voir components/Salle.tsx */}
      <div
        aria-hidden
        className="robe-trace pointer-events-none absolute left-1/2 top-1/2 h-[66vh] w-[66vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ "--trace-force": "0.06", "--trace-retard": "360ms" } as React.CSSProperties}
      />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <p className="eyebrow mb-14">L’origine</p>

        <blockquote className="voix t-citation text-os">
          <Line inView>« Le vin n’est pas compliqué.</Line>
          <Line inView delay={0.08}>On l’a compliqué. Le savoir existe.</Line>
          <Line inView delay={0.16}>
            Il est resté dans quelques têtes,
          </Line>
          <Line inView delay={0.24}>
            <span className="italic text-tungstene">
              au lieu d’arriver jusqu’à la table. »
            </span>
          </Line>
        </blockquote>

        <p className="t-corps mx-auto mt-12 max-w-lg text-cendre">
          Vintoria n’est pas né dans un laboratoire, mais derrière le passe.
          D’une conviction simple, apprise en des milliers de services : ce
          savoir ne nous appartient pas. Il nous a été confié, et notre métier
          est de le rendre. À la table, chaque soir.
        </p>

        <p className="voix mt-14 text-[clamp(1.5rem,3vw,2.2rem)] italic leading-tight text-os">
          Servir, c’est transmettre.
        </p>

        <div className="mt-14 flex flex-col items-center">
          <span aria-hidden className="h-px w-10 bg-laiton/60" />
          <p className="voix mt-6 text-[1.05rem] tracking-[0.22em] text-os">
            NEAL DUPONT
          </p>
          <p className="t-meta mt-2.5 max-w-sm text-cendre-2">
            Sommelier savoyard · dix ans en restaurants gastronomiques
            étoilés, en France et à l’international
          </p>
        </div>
      </div>
    </section>
  );
}

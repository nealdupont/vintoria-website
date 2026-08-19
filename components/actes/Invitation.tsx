import { Line } from "@/components/Line";

/**
 * ACTE VI — L’INVITATION.
 * Objection levée : « Je fais quoi maintenant ? »
 * On lève la dernière friction : dire exactement ce qui va se passer.
 */

const DEROULE = [
  { t: "Avant", d: "Vous nous envoyez votre carte des vins. Nous la chargeons." },
  { t: "20 min", d: "Nous vous montrons Vintoria à l’œuvre — sur vos vins, vos plats." },
  { t: "Après", d: "Vous décidez. Aucun engagement, aucune installation." },
];

export function Invitation() {
  return (
    <section
      id="reserver"
      className="px rythme-ample relative overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full opacity-80"
        style={{
          background:
            "radial-gradient(circle, rgba(232,200,140,0.16), rgba(110,16,35,0.10) 42%, transparent 70%)",
        }}
      />

      {/* La trace du vin retenu — voir components/Salle.tsx */}
      <div
        aria-hidden
        className="robe-trace pointer-events-none absolute right-[4%] top-[10%] h-[52vh] w-[52vh] rounded-full"
        style={{ "--trace-force": "0.05", "--trace-retard": "480ms" } as React.CSSProperties}
      />

      <div className="relative z-10 mx-auto max-w-[1500px]">
        <div className="grid items-end gap-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-24">
          <div>
            <p className="eyebrow mb-10">L’invitation</p>
            <h2 className="voix t-display text-os">
              <Line inView>Faites entrer un sommelier</Line>
              <Line inView delay={0.08}>
                <span className="italic text-tungstene">
                  à chaque table.
                </span>
              </Line>
            </h2>

            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5">
              <a
                href="mailto:contact@vintoria.com?subject=D%C3%A9monstration%20Vintoria&body=Bonjour%2C%0A%0AJe%20souhaite%20r%C3%A9server%20une%20d%C3%A9monstration%20de%20Vintoria.%0A%0A%C3%89tablissement%20%3A%0AVille%20%3A%0ACouverts%20par%20service%20%3A%0AR%C3%A9f%C3%A9rences%20%C3%A0%20la%20carte%20%3A%0A%0AMerci."
                className="group inline-flex min-h-[3.25rem] items-center gap-3 whitespace-nowrap rounded-full bg-os px-6 text-[0.75rem] uppercase tracking-[0.11em] text-encre sm:px-9 sm:tracking-[0.16em] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[0_12px_36px_-12px_rgba(236,229,216,0.5)]"
              >
                Réserver une démonstration
                <span
                  aria-hidden
                  className="transition-transform duration-500 group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
              <span className="eyebrow text-cendre-2">
                Réponse sous 24 h · sans engagement
              </span>
            </div>
          </div>

          {/* Ce qui va se passer — lever la dernière friction */}
          <div className="border-t border-[color:var(--color-filet)]">
            {DEROULE.map((e) => (
              <div
                key={e.t}
                className="grid grid-cols-[5.5rem_1fr] gap-x-6 border-b border-[color:var(--color-filet)] py-6"
              >
                <span className="data pt-1 text-[0.75rem] text-laiton">
                  {e.t}
                </span>
                <p className="t-corps text-cendre">{e.d}</p>
              </div>
            ))}
          </div>
        </div>

        <footer className="mt-28 flex flex-wrap items-baseline justify-between gap-6 border-t border-[color:var(--color-filet)] pt-10">
          <span className="voix text-lg tracking-[0.2em] text-os">VINTORIA</span>
          <span className="eyebrow">
            L’expertise du sommelier, à chaque table
          </span>
          <a
            href="mailto:contact@vintoria.com"
            className="eyebrow inline-flex min-h-[2.75rem] items-center transition-colors duration-300 hover:text-os"
          >
            contact@vintoria.com
          </a>
        </footer>
      </div>
    </section>
  );
}

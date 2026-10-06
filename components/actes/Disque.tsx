import { Film } from "@/components/film/Film";

/**
 * ACTE II — LE DISQUE.
 * Objection levée : « Qu'est-ce que ça fait, exactement ? »
 *
 * Le seul acte qui n'ouvre ni sur un titre ni sur une accroche : le film est
 * le propos, un titre lui ferait concurrence. Il occupe toute la largeur du
 * conteneur, et sa dernière image ouvre la démonstration jouable qui suit.
 */
export function Disque() {
  return (
    <section id="film" className="px rythme relative">
      <div className="relative z-10 mx-auto max-w-[1500px]">
        <p className="eyebrow mb-10">Le film · 18 secondes</p>
        <Film />
      </div>
    </section>
  );
}

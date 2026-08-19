import { Ouverture } from "@/components/actes/Ouverture";
import { Accord } from "@/components/actes/Accord";
import { Verite } from "@/components/actes/Verite";
import { Service } from "@/components/actes/Service";
import { Preuve } from "@/components/actes/Preuve";
import { Origine } from "@/components/actes/Origine";
import { Invitation } from "@/components/actes/Invitation";
import { Salle } from "@/components/Salle";

/**
 * L’ouverture porte la marque et la promesse.
 * Puis six actes, chacun levant une objection précise :
 * I   L’accord     — « C’est quoi, concrètement ? »  (la démonstration)
 * II  La vérité    — « Est-ce que j’ai ce problème ? »
 * III Le service   — « Est-ce que ça tient en plein coup de feu ? »
 * IV  La preuve    — « Est-ce que ça rapporte ? »
 * V   L’origine    — « Puis-je leur faire confiance ? »
 * VI  L’invitation — « Je fais quoi maintenant ? »
 *
 * La Salle enveloppe l’ensemble : le vin retenu à l’acte I laisse sa robe
 * sur tous les actes suivants. Le choix du visiteur a une conséquence.
 */
export default function Page() {
  return (
    <Salle>
      <Ouverture />
      <Accord />
      <Verite />
      <Service />
      <Preuve />
      <Origine />
      <Invitation />
    </Salle>
  );
}

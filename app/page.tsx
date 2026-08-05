import { Accord } from "@/components/actes/Accord";
import { Verite } from "@/components/actes/Verite";
import { Service } from "@/components/actes/Service";
import { Preuve } from "@/components/actes/Preuve";
import { Origine } from "@/components/actes/Origine";
import { Invitation } from "@/components/actes/Invitation";

/**
 * Six actes. Chacun lève une objection précise :
 * I   L’accord     — « C’est quoi, concrètement ? »
 * II  La vérité    — « Est-ce que j’ai ce problème ? »
 * III Le service   — « Est-ce que ça tient en plein coup de feu ? »
 * IV  La preuve    — « Est-ce que ça rapporte ? »
 * V   L’origine    — « Puis-je leur faire confiance ? »
 * VI  L’invitation — « Je fais quoi maintenant ? »
 */
export default function Page() {
  return (
    <>
      <Accord />
      <Verite />
      <Service />
      <Preuve />
      <Origine />
      <Invitation />
    </>
  );
}

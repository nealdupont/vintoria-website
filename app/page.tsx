import { Salle } from "@/components/Salle";
import { Heros } from "@/components/mouvements/Heros";
import { Probleme } from "@/components/mouvements/Probleme";
import { Systeme } from "@/components/mouvements/Systeme";
import { Ventes } from "@/components/mouvements/Ventes";
import { Conseil } from "@/components/mouvements/Conseil";
import { Cave } from "@/components/mouvements/Cave";
import { Produit } from "@/components/mouvements/Produit";
import { PourQui } from "@/components/mouvements/PourQui";
import { Invitation } from "@/components/mouvements/Invitation";

/**
 * L'ACCUEIL — neuf mouvements, dans l'ordre d'une vente.
 *
 *  1 Le héros      la promesse, pour qui, et quoi faire
 *  2 Le problème   « est-ce que j'ai ce problème ? »
 *  3 Le système    « comment ça marche ? » — une bouteille, cinq états
 *  4 Les ventes    « est-ce que ça rapporte ? »
 *  5 Le conseil    « c'est quoi, concrètement ? » — la démonstration jouable
 *  6 La cave       « et mon travail à moi ? » — le seul mouvement de jour
 *  7 Le produit    « à quoi ça ressemble vraiment ? » — les vrais écrans
 *  8 Pour qui      « est-ce que c'est pour une maison comme la mienne ? »
 *  9 L'invitation  « je fais quoi maintenant ? »
 *
 * La Salle enveloppe l'ensemble : le vin retenu au mouvement 5 laisse sa robe
 * sur les mouvements suivants. Le choix du visiteur a une conséquence.
 */
export default function Page() {
  return (
    <Salle>
      <Heros />
      <Probleme />
      <Systeme />
      <Ventes />
      <Conseil />
      <Cave />
      <Produit />
      <PourQui />
      <Invitation />
    </Salle>
  );
}

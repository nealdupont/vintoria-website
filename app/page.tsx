import type { Viewport } from "next";
import { Ouverture } from "@/components/lumiere/Ouverture";
import { Geste } from "@/components/lumiere/Geste";
import { Cave } from "@/components/lumiere/Cave";
import { Accord } from "@/components/lumiere/Accord";
import { Table } from "@/components/lumiere/Table";
import { Instant } from "@/components/lumiere/Instant";
import { PourQui } from "@/components/lumiere/PourQui";
import { Invitation } from "@/components/lumiere/Invitation";

/**
 * L'ACCUEIL — LA LUMIÈRE TRAVERSÉE.
 *
 * UNE JOURNÉE DE SERVICE, du matin clair à la dernière heure du jour. L'ordre des huit
 * mouvements n'est pas seulement commercial : il suit l'ARC DU JOUR, et les
 * deux coïncident.
 *
 *  I    L'ouverture   le désir          · matin, lumière haute
 *  II   Le geste      « ça entre ? »    · le jour se lève, teinté de feuille
 *  III  La cave       la preuve         · plein midi, la crème la plus claire
 *  IV   L'accord      « ça marche ? »   · début d'après-midi, on se penche
 *  V    La table      le passage        · l'après-midi s'allonge
 *  VI   L'instant     le convive        · le service, lumière basse et chaude
 *  VII  Pour qui      la respiration    · un calme, teinté de sauge
 *  VIII L'invitation  l'appel           · la dernière heure — puis le pied
 *
 * POURQUOI L'INSTANT EST EN VI ET NON EN II. Les écrans du parcours convive
 * sont SOMBRES — le client choisit son vin le soir, à table. Les placer tôt
 * forçait la lumière à redescendre puis à remonter, et l'arc se contredisait.
 * En VI, le soir du récit et le soir du produit coïncident.
 *
 * UN SEUL APPEL À L'ACTION porte la page, en VIII. Les sections intermédiaires
 * n'en ont aucun : un lecteur sollicité partout n'écoute plus nulle part.
 *
 * `lib/lumiere.ts` détient les neuf fonds et garantit que le bas de chaque
 * heure est le haut de la suivante. Les anciens mouvements sombres restent
 * INTACTS dans `components/mouvements/` — ils ne sont simplement plus montés.
 */
/**
 * L'accueil est dans le thème `creme` : la barre du navigateur prend la crème
 * de la marque (--vintoria-creme-fond), là où les routes du soir gardent le
 * fond nuit posé par la mise en page racine. Un test compare cette valeur au
 * jeton synchronisé.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F8F1EA",
};

export default function Page() {
  return (
    <div data-vintoria-theme="creme" className="lumiere bg-fond text-texte">
      <Ouverture />
      <Geste />
      <Cave />
      <Accord />
      <Table />
      <Instant />
      <PourQui />
      <Invitation />
    </div>
  );
}

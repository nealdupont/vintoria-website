import { Bodoni_Moda } from "next/font/google";
import { Ouverture } from "@/components/lumiere/Ouverture";
import { Geste } from "@/components/lumiere/Geste";
import { Cave } from "@/components/lumiere/Cave";
import { CarteDesVins } from "@/components/lumiere/CarteDesVins";
import { Table } from "@/components/lumiere/Table";
import { Instant } from "@/components/lumiere/Instant";
import { PourQui } from "@/components/lumiere/PourQui";
import { Formules } from "@/components/lumiere/Formules";
import { Invitation } from "@/components/lumiere/Invitation";

/**
 * L'ACCUEIL — LA LUMIÈRE TRAVERSÉE.
 *
 * UNE JOURNÉE DE SERVICE, du matin clair à l'heure dorée. L'ordre des huit
 * mouvements n'est pas seulement commercial : il suit l'ARC DU JOUR, et les
 * deux coïncident.
 *
 *  I    L'ouverture   le désir          · matin, lumière haute
 *  II   Le geste      « ça entre ? »    · le jour se lève, teinté de feuille
 *  III  La cave       la preuve         · plein midi, la craie de l'Atelier
 *  IV   L'accord      « ça marche ? »   · début d'après-midi, on se penche
 *  V    La table      le passage        · l'après-midi s'allonge
 *  VI   L'instant     le convive        · le service, lumière basse et chaude
 *  VII  Pour qui      la respiration    · un calme, teinté de sauge
 *  VIII Les formules  le prix           · la lumière se tient : on compare
 *  IX   L'invitation  l'appel           · l'heure dorée — puis le pied

 * POURQUOI LES FORMULES EN VIII ET NON PLUS TÔT. Un prix lu avant qu'on
 * ait montré ce qu'il achète est un chiffre nu ; lu après l'appel à
 * l'action, il arrive trop tard. Entre la respiration et l'heure dorée,
 * le lecteur s'est reconnu, il a vu l'outil, et il n'a pas encore été
 * sollicité : c'est le seul endroit où « combien ? » est une question
 * qu'il se pose déjà.
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
 * LA TROISIÈME VOIX — LA GRAVURE, et elle ne sort pas d'ici.
 *
 * Spectral et Archivo portent tout le site. Le mouvement II demande
 * autre chose : une silhouette taillée, à très fort contraste de plein et
 * de délié, dont les capitales tiennent la moitié d'un écran. Spectral a
 * été dessiné pour se lire de 12 à 100 px dans un traitement de texte —
 * c'est sa qualité, et c'est pourquoi il ne sculpte pas.
 *
 * Bodoni Moda (SIL OFL) est un didone : né de la gravure au burin, donc
 * exactement la matière cherchée. Il est DÉCLARÉ ICI, et non dans la mise
 * en page racine : /tarifs et /demonstration ne le téléchargent jamais.
 * Deux fichiers de plus sur l'accueil, pour la seule section qui s'en
 * sert — et aucune autre règle typographique du site n'est touchée.
 */
const gravure = Bodoni_Moda({
  variable: "--font-gravure-src",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export default function Page() {
  return (
    <div className={`${gravure.variable} lumiere bg-fond text-texte`}>
      <Ouverture />
      <Geste />
      <Cave />
      <CarteDesVins />
      <Table />
      <Instant />
      <PourQui />
      <Formules />
      <Invitation />
    </div>
  );
}

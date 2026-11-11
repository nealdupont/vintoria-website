import { Ouverture } from "@/components/accueil/Ouverture";
import { Constat } from "@/components/accueil/Constat";
import { Etapes } from "@/components/accueil/Etapes";
import { Fonctionnalites } from "@/components/accueil/Fonctionnalites";
import { Benefices } from "@/components/accueil/Benefices";
import { Origine } from "@/components/accueil/Origine";
import { PourQui } from "@/components/accueil/PourQui";
import { Formules } from "@/components/accueil/Formules";
import { Questions } from "@/components/site/Questions";
import { AppelFinal } from "@/components/site/AppelFinal";

/**
 * L'ACCUEIL : le site vitrine, la première rencontre avec Vintoria.
 *
 * Il ne montre pas le logiciel, il le vend. L'ordre suit la décision d'un
 * restaurateur :
 *
 *   I     L'ouverture       la promesse, et la porte d'entrée
 *   II    Le constat        « c'est bien ma salle »
 *   III   Les étapes        « ça ne va pas me compliquer la vie »
 *   IV    Fonctionnalités   ce que fait Vintoria, en salle, en cave, sur la carte
 *   V     Bénéfices         ce que j'y gagne
 *         L'origine         pourquoi lui faire confiance
 *   VI    Pour qui          « c'est pour moi »
 *   VII   Formules          combien, et comment commencer
 *   VIII  Questions         les derniers doutes
 *   IX    L'appel           la porte, une dernière fois
 *
 * Une seule action principale sur tout le site : l'essai gratuit, qui mène
 * à l'inscription de Vintoria Pro. La démonstration reste offerte à qui
 * préfère qu'on lui montre.
 */
export default function Page() {
  return (
    <>
      <Ouverture />
      <Constat />
      <Etapes />
      <Fonctionnalites />
      <Benefices />
      <Origine />
      <PourQui />
      <Formules />
      <Questions />
      <AppelFinal />
    </>
  );
}

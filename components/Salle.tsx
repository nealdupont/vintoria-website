"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { robeDe, variablesRobe } from "@/lib/robes";

/**
 * LA SALLE — ce que le choix du client laisse derrière lui.
 *
 * La démonstration retient un vin. Sa robe ne s'arrête plus au bord de
 * l'acte : elle devient la lumière de la salle jusqu'à l'invitation.
 * Le visiteur fait un choix ; Vintoria le retient ; le choix continue
 * d'avoir une conséquence. C'est le produit, appliqué au visiteur.
 *
 * Ce n'est PAS un thème. On ne pose ici que deux tons et un interrupteur ;
 * les actes n'en prennent qu'une trace, de plus en plus faible en
 * descendant. Voir `.robe-trace` dans globals.css.
 *
 * COÛT : les actes arrivent en `children` depuis un composant serveur, donc
 * leur arbre est stable et React le saute. Le contexte n'expose qu'une
 * fonction mémoïsée, dont la valeur ne change jamais : aucun consommateur ne
 * se re-rend. Un changement de vin ne réécrit qu'un attribut `style`.
 */

const ContexteRobe = createContext<(vinId: string | null) => void>(() => {});

/** Remonte à la salle le vin retenu par la démonstration. */
export function useRobeRetenue() {
  return useContext(ContexteRobe);
}

export function Salle({ children }: { children: React.ReactNode }) {
  const [vinRetenu, setVinRetenu] = useState<string | null>(null);
  const poserRobe = useCallback((id: string | null) => setVinRetenu(id), []);

  return (
    <ContexteRobe.Provider value={poserRobe}>
      <div
        style={
          {
            ...variablesRobe(robeDe(vinRetenu)),
            /* L'interrupteur : sans vin lu, les traces valent zéro. */
            "--robe-presence": vinRetenu ? "1" : "0",
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </ContexteRobe.Provider>
  );
}

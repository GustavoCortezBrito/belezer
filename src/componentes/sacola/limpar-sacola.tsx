"use client";

import { useEffect } from "react";
import { useSacola } from "./loja-sacola";

export function LimparSacola() {
  const limpar = useSacola((estado) => estado.limpar);

  useEffect(() => {
    // A sacola é reidratada do navegador ao abrir a página, então limpa depois disso.
    if (useSacola.persist.hasHydrated()) limpar();
    return useSacola.persist.onFinishHydration(() => limpar());
  }, [limpar]);

  return null;
}

"use client";

import { ShoppingBag } from "lucide-react";
import { useSacola } from "./loja-sacola";

export function BotaoSacola() {
  const abrir = useSacola((estado) => estado.abrir);
  const total = useSacola((estado) => estado.itens.reduce((soma, item) => soma + item.quantidade, 0));

  return (
    <button
      type="button"
      onClick={abrir}
      aria-label={`Abrir sacola, ${total} ${total === 1 ? "item" : "itens"}`}
      className="relative inline-flex size-11 cursor-pointer items-center justify-center rounded-full hover:bg-creme"
    >
      <ShoppingBag size={20} strokeWidth={1.75} aria-hidden />
      {total > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-coral text-xs font-bold text-on-coral">
          {total}
        </span>
      )}
    </button>
  );
}

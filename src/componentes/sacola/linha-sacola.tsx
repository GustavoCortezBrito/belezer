"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { ImagemProduto } from "@/componentes/vitrine/imagem-produto";
import { formatarPreco } from "@/lib/formato";
import { useSacola, type ItemSacola } from "./loja-sacola";

const CLASSE_CONTROLE = "inline-flex size-11 cursor-pointer items-center justify-center rounded-full hover:bg-creme";

export function LinhaSacola({ item }: { item: ItemSacola }) {
  const alterarQuantidade = useSacola((estado) => estado.alterarQuantidade);
  const remover = useSacola((estado) => estado.remover);
  const titulo = [item.nome, item.medida].filter(Boolean).join(" ");

  return (
    <li className="flex gap-3 py-4">
      <div className="flex size-20 shrink-0 items-end justify-center overflow-hidden rounded-md bg-creme">
        <ImagemProduto
          nome={titulo}
          categoria={item.categoria}
          medida={item.medida}
          imagem={item.imagem}
          className="h-[80%]"
          tamanhos="80px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold leading-snug">{titulo}</p>
        <p className="text-sm tabular-nums text-carvao-suave">{formatarPreco(item.precoCentavos)}</p>
        <div className="mt-1 flex items-center">
          <button
            type="button"
            aria-label={`Diminuir quantidade de ${titulo}`}
            className={CLASSE_CONTROLE}
            onClick={() => alterarQuantidade(item.slug, item.quantidade - 1)}
          >
            <Minus size={20} strokeWidth={1.75} aria-hidden />
          </button>
          <span className="w-6 text-center tabular-nums" aria-live="polite">
            {item.quantidade}
          </span>
          <button
            type="button"
            aria-label={`Aumentar quantidade de ${titulo}`}
            className={CLASSE_CONTROLE}
            onClick={() => alterarQuantidade(item.slug, item.quantidade + 1)}
          >
            <Plus size={20} strokeWidth={1.75} aria-hidden />
          </button>
          <button
            type="button"
            aria-label={`Remover ${titulo} da sacola`}
            className={`${CLASSE_CONTROLE} ml-auto`}
            onClick={() => remover(item.slug)}
          >
            <Trash2 size={20} strokeWidth={1.75} aria-hidden />
          </button>
        </div>
      </div>
    </li>
  );
}

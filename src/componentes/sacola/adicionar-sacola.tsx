"use client";

import { classesBotao } from "@/componentes/ui/botao";
import type { Produto } from "@/lib/catalogo/tipos";
import { useSacola } from "./loja-sacola";

export function AdicionarSacola({
  produto,
  esgotado = false,
  className = "",
}: {
  produto: Produto;
  esgotado?: boolean;
  className?: string;
}) {
  const adicionar = useSacola((estado) => estado.adicionar);

  return (
    <button
      type="button"
      disabled={esgotado}
      className={classesBotao("primario", className)}
      onClick={() =>
        adicionar({
          slug: produto.slug,
          nome: produto.nome,
          medida: produto.medida,
          categoria: produto.categoria,
          precoCentavos: produto.precoCentavos,
          imagem: produto.imagem,
        })
      }
    >
      {esgotado ? "Esgotado" : "Adicionar à sacola"}
    </button>
  );
}

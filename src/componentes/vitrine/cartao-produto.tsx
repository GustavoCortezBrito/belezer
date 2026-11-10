"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { AdicionarSacola } from "@/componentes/sacola/adicionar-sacola";
import type { Produto } from "@/lib/catalogo/tipos";
import { formatarPreco } from "@/lib/formato";
import { CURVA, DURACAO } from "@/lib/movimento";
import { ImagemProduto } from "./imagem-produto";

const FORMA = {
  repouso: { borderRadius: "50% 50% 0% 0%" },
  aberta: { borderRadius: "0% 100% 0% 100%" },
};

export function CartaoProduto({ produto }: { produto: Produto }) {
  const reduzir = useReducedMotion();
  const titulo = [produto.nome, produto.medida].filter(Boolean).join(" ");
  const emOferta = produto.precoAnteriorCentavos !== undefined;

  return (
    <motion.article
      initial="repouso"
      whileHover={reduzir ? undefined : "aberta"}
      className="flex flex-col overflow-hidden rounded-md border border-linha bg-papel"
    >
      <Link href={`/produtos/${produto.slug}`} className="flex flex-1 flex-col">
        <div className="relative flex aspect-square items-end justify-center overflow-hidden bg-creme">
          <motion.span
            aria-hidden
            variants={FORMA}
            transition={{ duration: DURACAO.assinatura, ease: CURVA }}
            className="absolute inset-x-[20%] bottom-0 top-[14%] bg-pessego"
          />
          <ImagemProduto
            nome={titulo}
            categoria={produto.categoria}
            medida={produto.medida}
            imagem={produto.imagem}
            className="mb-[8%] h-[72%]"
            tamanhos="(min-width: 1024px) 25vw, 50vw"
          />
          {emOferta ? (
            <span className="absolute left-3 top-3 rounded-sm bg-coral px-2 py-1.5 text-xs font-bold leading-none text-on-coral">
              Oferta
            </span>
          ) : (
            produto.novidade && (
              <span className="absolute left-3 top-3 rounded-sm bg-broto px-2 py-1.5 text-xs font-bold leading-none text-carvao">
                Novidade
              </span>
            )
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1 p-3 md:p-4">
          <span className="rotulo text-carvao-suave">{produto.marca}</span>
          <h3 className="texto-titulo">{titulo}</h3>
          <div className="mt-auto pt-2">
            {emOferta && (
              <span className="block text-sm text-carvao-suave line-through">
                {formatarPreco(produto.precoAnteriorCentavos!)}
              </span>
            )}
            <span className={`texto-preco ${emOferta ? "text-coral-texto" : ""}`}>
              {formatarPreco(produto.precoCentavos)}
            </span>
          </div>
        </div>
      </Link>
      <div className="px-3 pb-3 md:px-4 md:pb-4">
        <AdicionarSacola produto={produto} className="w-full !px-3 text-sm md:text-base" />
      </div>
    </motion.article>
  );
}

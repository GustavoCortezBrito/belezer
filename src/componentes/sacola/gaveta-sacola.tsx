"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { classesBotao } from "@/componentes/ui/botao";
import { formatarPreco } from "@/lib/formato";
import { CURVA, DURACAO } from "@/lib/movimento";
import { LinhaSacola } from "./linha-sacola";
import { subtotalCentavos, useSacola } from "./loja-sacola";

const TRANSICAO = { duration: DURACAO.interface, ease: CURVA };

function FecharAoNavegar() {
  const fechar = useSacola((estado) => estado.fechar);
  const pathname = usePathname();

  useEffect(() => {
    fechar();
  }, [pathname, fechar]);

  return null;
}

export function GavetaSacola() {
  const aberta = useSacola((estado) => estado.aberta);
  const itens = useSacola((estado) => estado.itens);
  const fechar = useSacola((estado) => estado.fechar);
  const botaoFechar = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!aberta) return;
    botaoFechar.current?.focus();
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") fechar();
    };
    window.addEventListener("keydown", aoTeclar);
    return () => {
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener("keydown", aoTeclar);
    };
  }, [aberta, fechar]);

  return (
    <>
      <Suspense fallback={null}>
        <FecharAoNavegar />
      </Suspense>
      <AnimatePresence>
      {aberta && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-carvao/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={TRANSICAO}
            onClick={fechar}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Sua sacola"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-papel shadow-flutuante"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={TRANSICAO}
          >
            <header className="flex items-center justify-between border-b border-linha px-4 py-2">
              <h2 className="texto-titulo">Sua sacola</h2>
              <button
                ref={botaoFechar}
                type="button"
                aria-label="Fechar sacola"
                onClick={fechar}
                className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full hover:bg-creme"
              >
                <X size={20} strokeWidth={1.75} aria-hidden />
              </button>
            </header>

            {itens.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <p>Sua sacola está vazia. Comece pela seleção Truss.</p>
                <Link href="/produtos" className={classesBotao("contorno")}>
                  Ver produtos
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-linha overflow-y-auto px-4">
                  {itens.map((item) => (
                    <LinhaSacola key={item.slug} item={item} />
                  ))}
                </ul>
                <footer className="space-y-3 border-t border-linha p-4">
                  <p className="flex items-baseline justify-between">
                    <span>Subtotal</span>
                    <span className="texto-preco">{formatarPreco(subtotalCentavos(itens))}</span>
                  </p>
                  <p className="text-sm text-carvao-suave">Frete calculado na próxima etapa.</p>
                  <Link href="/checkout" className={classesBotao("escuro", "w-full")}>
                    Finalizar compra
                  </Link>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
      </AnimatePresence>
    </>
  );
}

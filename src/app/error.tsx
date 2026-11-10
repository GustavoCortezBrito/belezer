"use client";

import { classesBotao } from "@/componentes/ui/botao";
import { loja } from "@/config/loja";

export default function Erro({ reset }: { reset: () => void }) {
  return (
    <div className="conteudo py-24 text-center">
      <h1 className="display-lg">Não conseguimos carregar esta página</h1>
      <p className="mt-4">Tente de novo em instantes. Se preferir, fale com a gente pelo WhatsApp.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className={classesBotao("escuro")}>
          Tentar de novo
        </button>
        <a href={loja.whatsappUrl} className={classesBotao("contorno")}>
          Falar no WhatsApp
        </a>
      </div>
    </div>
  );
}

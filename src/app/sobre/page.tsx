import type { Metadata } from "next";
import Image from "next/image";
import { classesBotao } from "@/componentes/ui/botao";
import { loja } from "@/config/loja";

export const metadata: Metadata = {
  title: "A loja",
  description: "Conheça a Belezer, loja de beleza em Barretos.",
};

export default function Sobre() {
  return (
    <div className="conteudo grid items-center gap-8 py-12 md:grid-cols-2 md:gap-12 md:py-24">
      <div>
        <p className="rotulo mb-4">{loja.cidade}</p>
        <h1 className="display-xl">{loja.frase}</h1>
        <p className="mt-6 max-w-[52ch] text-lg">
          A Belezer reúne produtos que celebram a sua autenticidade. Na loja de Barretos e aqui no site, você encontra a
          Truss como marca principal e uma equipe pronta para indicar o cuidado certo.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={loja.whatsappUrl} className={classesBotao("escuro")}>
            Falar no WhatsApp
          </a>
          <a href={loja.instagramUrl} className={classesBotao("contorno")}>
            Ver o Instagram
          </a>
        </div>
      </div>
      <Image
        src="/marca/fachada.webp"
        alt="Fachada da loja Belezer, com vitrine de produtos e arco de balões vermelhos na entrada"
        width={590}
        height={722}
        priority
        sizes="(min-width: 768px) 40vw, 100vw"
        className="mx-auto w-full max-w-md rounded-lg"
      />
    </div>
  );
}

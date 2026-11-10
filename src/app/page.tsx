import Image from "next/image";
import Link from "next/link";
import { DestaqueTopo } from "@/componentes/home/destaque-topo";
import { classesBotao } from "@/componentes/ui/botao";
import { Revelar } from "@/componentes/ui/revelar";
import { GradeProdutos } from "@/componentes/vitrine/grade-produtos";
import { loja } from "@/config/loja";
import { agruparLinhas, obterBanner, obterCatalogo } from "@/lib/catalogo";
import { CATEGORIAS, type Categoria } from "@/lib/catalogo/tipos";

export default async function Home() {
  const [produtos, banner] = await Promise.all([obterCatalogo(), obterBanner()]);
  const destaques = produtos.filter((produto) => produto.destaque).slice(0, 8);
  const linhas = agruparLinhas(produtos).filter((linha) => linha.total > 1);
  const totalPorCategoria = (categoria: Categoria) => produtos.filter((p) => p.categoria === categoria).length;

  return (
    <>
      <DestaqueTopo banner={banner} />

      <section className="conteudo py-16 md:py-24">
        <h2 className="display-lg mb-8">O que você procura hoje?</h2>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6">
          {(Object.keys(CATEGORIAS) as Categoria[])
            .filter((categoria) => totalPorCategoria(categoria) > 0)
            .map((categoria) => (
              <li key={categoria}>
                <Link
                  href={`/produtos?categoria=${categoria}`}
                  className="group relative flex h-32 flex-col justify-end overflow-hidden rounded-md bg-creme p-4 md:h-44"
                >
                  <span
                    aria-hidden
                    className="absolute -right-8 -top-8 size-28 rounded-[0_100%_0_100%] bg-pessego transition duration-480 ease-belezer group-hover:scale-125 motion-reduce:transition-none md:size-36"
                  />
                  <span className="relative font-display text-2xl leading-tight md:text-[32px]">
                    {CATEGORIAS[categoria]}
                  </span>
                  <span className="relative text-sm text-carvao-suave">{totalPorCategoria(categoria)} produtos</span>
                </Link>
              </li>
            ))}
        </ul>
      </section>

      <section className="conteudo pb-16 md:pb-24">
        <Revelar>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="display-lg">Seleção Truss</h2>
            <Link href="/produtos" className="font-semibold text-coral-texto underline underline-offset-4">
              Ver todos os produtos
            </Link>
          </div>
          <GradeProdutos produtos={destaques} />
        </Revelar>
      </section>

      <section className="fundo-escuro bg-jardim text-on-escuro">
        <Revelar className="conteudo py-16 md:py-24">
          <h2 className="display-lg mb-8">Escolha pela necessidade do seu cabelo</h2>
          <ul className="grid gap-x-12 md:grid-cols-2">
            {linhas.map((linha) => (
              <li key={linha.slug} className="border-t border-on-escuro/25">
                <Link href={`/linhas/${linha.slug}`} className="group block py-4">
                  <span className="font-display text-2xl leading-tight group-hover:text-pessego">{linha.nome}</span>
                  <span className="mt-1 block text-sm">{linha.descricao}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Revelar>
      </section>

      <section className="bg-creme">
        <Revelar className="conteudo grid items-center gap-8 py-16 md:grid-cols-2 md:py-24">
          <Image
            src="/marca/fachada.webp"
            alt="Fachada da loja Belezer, com vitrine de produtos e arco de balões vermelhos na entrada"
            width={590}
            height={722}
            sizes="(min-width: 768px) 40vw, 100vw"
            className="mx-auto w-full max-w-md rounded-lg"
          />
          <div>
            <p className="rotulo mb-4">{loja.cidade}</p>
            <h2 className="display-lg">Com dúvida? A nossa equipe ajuda.</h2>
            <p className="mt-4 max-w-[46ch]">
              Conte como está o seu cabelo pelo WhatsApp e receba uma indicação de quem conhece cada linha.
            </p>
            <a href={loja.whatsappUrl} className={`${classesBotao("escuro")} mt-8`}>
              Falar no WhatsApp
            </a>
          </div>
        </Revelar>
      </section>
    </>
  );
}

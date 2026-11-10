import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdicionarSacola } from "@/componentes/sacola/adicionar-sacola";
import { GradeProdutos } from "@/componentes/vitrine/grade-produtos";
import { ImagemProduto } from "@/componentes/vitrine/imagem-produto";
import { loja } from "@/config/loja";
import { obterCatalogo, obterProduto } from "@/lib/catalogo";
import type { Produto } from "@/lib/catalogo/tipos";
import { obterEstoque } from "@/lib/estoque";
import { formatarPreco } from "@/lib/formato";

export async function generateStaticParams() {
  return (await obterCatalogo()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/produtos/[slug]">): Promise<Metadata> {
  const produto = await obterProduto((await params).slug);
  return produto ? { title: `${produto.nome} ${produto.medida}`.trim(), description: produto.descricao } : {};
}

export default async function PaginaProduto({ params }: PageProps<"/produtos/[slug]">) {
  const { slug } = await params;
  const produto = await obterProduto(slug);
  if (!produto) notFound();

  const titulo = [produto.nome, produto.medida].filter(Boolean).join(" ");
  const relacionados = (await obterCatalogo())
    .filter((outro) => outro.linha === produto.linha && outro.slug !== produto.slug)
    .slice(0, 4);
  const emOferta = produto.precoAnteriorCentavos !== undefined;

  return (
    <div className="conteudo py-8 md:py-12">
      <nav aria-label="Caminho" className="mb-6 text-sm text-carvao-suave">
        <Link href="/produtos" className="underline underline-offset-4">
          Produtos
        </Link>{" "}
        /{" "}
        <Link href={`/linhas/${produto.linha}`} className="underline underline-offset-4">
          {produto.linhaNome}
        </Link>
      </nav>

      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <div>
          <div className="relative flex aspect-square items-end justify-center overflow-hidden rounded-lg bg-creme">
            <span aria-hidden className="absolute inset-x-[22%] bottom-0 top-[12%] rounded-t-full bg-pessego" />
            <ImagemProduto
              nome={titulo}
              categoria={produto.categoria}
              medida={produto.medida}
              imagem={produto.imagem}
              className="mb-[8%] h-[74%]"
              tamanhos="(min-width: 768px) 50vw, 100vw"
              prioridade
            />
          </div>
          {!produto.imagem && <p className="mt-2 text-sm text-carvao-suave">Ilustração. Foto do produto em breve.</p>}
        </div>

        <div>
          <p className="rotulo text-carvao-suave">{produto.marca}</p>
          <h1 className="display-md mt-2">{titulo}</h1>
          <div className="mt-6">
            {emOferta && (
              <span className="block text-sm text-carvao-suave line-through">
                {formatarPreco(produto.precoAnteriorCentavos!)}
              </span>
            )}
            <span className={`texto-preco ${emOferta ? "text-coral-texto" : ""}`}>
              {formatarPreco(produto.precoCentavos)}
            </span>
          </div>

          <div className="mt-6">
            <Suspense fallback={<AdicionarSacola produto={produto} className="w-full md:w-auto" />}>
              <Compra produto={produto} />
            </Suspense>
          </div>

          <div className="mt-8 space-y-6 border-t border-linha pt-6">
            <section>
              <h2 className="texto-titulo">Sobre o produto</h2>
              <p className="mt-1">{produto.descricao}</p>
            </section>
            {produto.comoUsar && (
              <section>
                <h2 className="texto-titulo">Como usar</h2>
                <p className="mt-1">{produto.comoUsar}</p>
              </section>
            )}
            <p className="text-sm text-carvao-suave">
              Com dúvida sobre este produto?{" "}
              <a href={loja.whatsappUrl} className="font-semibold text-coral-texto underline underline-offset-4">
                Fale com a nossa equipe no WhatsApp
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      {relacionados.length > 0 && (
        <section className="mt-16 md:mt-24">
          <h2 className="display-lg mb-8">Da mesma linha</h2>
          <GradeProdutos produtos={relacionados} />
        </section>
      )}
    </div>
  );
}

async function Compra({ produto }: { produto: Produto }) {
  const quantidade = (await obterEstoque([produto.slug])).get(produto.slug);
  return (
    <>
      <AdicionarSacola produto={produto} esgotado={quantidade === 0} className="w-full md:w-auto" />
      {quantidade !== undefined && quantidade > 0 && quantidade <= 5 && (
        <p className="mt-2 text-sm font-semibold text-alerta">
          Últimas {quantidade} {quantidade === 1 ? "unidade" : "unidades"}
        </p>
      )}
    </>
  );
}

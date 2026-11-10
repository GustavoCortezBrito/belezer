import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GradeProdutos } from "@/componentes/vitrine/grade-produtos";
import { agruparLinhas, filtrarProdutos, obterCatalogo } from "@/lib/catalogo";

const buscarLinha = async (slug: string) => agruparLinhas(await obterCatalogo()).find((linha) => linha.slug === slug);

export async function generateStaticParams() {
  return agruparLinhas(await obterCatalogo()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/linhas/[slug]">): Promise<Metadata> {
  const linha = await buscarLinha((await params).slug);
  return linha ? { title: linha.nome, description: linha.descricao } : {};
}

export default async function PaginaLinha({ params }: PageProps<"/linhas/[slug]">) {
  const { slug } = await params;
  const linha = await buscarLinha(slug);
  if (!linha) notFound();

  const produtos = filtrarProdutos(await obterCatalogo(), { linha: slug });

  return (
    <>
      <section className="brisa">
        <div className="conteudo py-12 md:py-24">
          <p className="rotulo mb-4">Truss</p>
          <h1 className="display-xl">{linha.nome}</h1>
          <p className="mt-4 max-w-[46ch] text-lg">{linha.descricao}</p>
        </div>
      </section>
      <div className="conteudo py-12 md:py-16">
        <GradeProdutos produtos={produtos} />
      </div>
    </>
  );
}

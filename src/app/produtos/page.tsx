import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { classesBotao } from "@/componentes/ui/botao";
import { GradeProdutos } from "@/componentes/vitrine/grade-produtos";
import { filtrarProdutos, obterCatalogo } from "@/lib/catalogo";
import { CATEGORIAS } from "@/lib/catalogo/tipos";

export const metadata: Metadata = { title: "Produtos" };

type Busca = PageProps<"/produtos">["searchParams"];

const parametro = (valor: string | string[] | undefined) => (typeof valor === "string" ? valor : undefined);

export default function Produtos({ searchParams }: PageProps<"/produtos">) {
  return (
    <div className="conteudo py-8 md:py-12">
      <Suspense fallback={<p className="py-24 text-center text-carvao-suave">Carregando produtos...</p>}>
        <Listagem searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Listagem({ searchParams }: { searchParams: Busca }) {
  const parametros = await searchParams;
  const categoria = parametro(parametros.categoria);
  const busca = parametro(parametros.busca);
  const produtos = filtrarProdutos(await obterCatalogo(), { categoria, busca });
  const titulo = busca ? `Resultados para "${busca}"` : categoria && categoria in CATEGORIAS
    ? CATEGORIAS[categoria as keyof typeof CATEGORIAS]
    : "Todos os produtos";

  return (
    <>
      <h1 className="display-lg">{titulo}</h1>
      <p className="mt-1 text-carvao-suave">
        {produtos.length} {produtos.length === 1 ? "produto" : "produtos"}
      </p>

      <form action="/produtos" role="search" className="mt-6 flex max-w-md gap-2 md:hidden">
        <label htmlFor="busca-lista" className="sr-only">
          Buscar produtos
        </label>
        <input
          id="busca-lista"
          name="busca"
          type="search"
          defaultValue={busca}
          placeholder="Buscar produtos"
          className="min-h-11 w-full min-w-0 rounded-full border-[1.5px] border-borda bg-papel px-4"
        />
        <button type="submit" className={classesBotao("escuro")}>
          Buscar
        </button>
      </form>

      <nav aria-label="Filtrar por categoria" className="mb-8 mt-6 flex gap-2 overflow-x-auto pb-1">
        <Filtro href="/produtos" ativo={!categoria} nome="Todos" />
        {Object.entries(CATEGORIAS).map(([slug, nome]) => (
          <Filtro key={slug} href={`/produtos?categoria=${slug}`} ativo={categoria === slug} nome={nome} />
        ))}
      </nav>

      {produtos.length > 0 ? (
        <GradeProdutos produtos={produtos} />
      ) : (
        <div className="py-16 text-center">
          <p>Não encontramos produtos com esse filtro. Tente outra palavra ou veja todos os produtos.</p>
          <Link href="/produtos" className={`${classesBotao("contorno")} mt-6`}>
            Ver todos os produtos
          </Link>
        </div>
      )}
    </>
  );
}

function Filtro({ href, ativo, nome }: { href: string; ativo: boolean; nome: string }) {
  return (
    <Link
      href={href}
      aria-current={ativo ? "page" : undefined}
      className={`inline-flex min-h-11 shrink-0 items-center rounded-full border-[1.5px] px-4 text-sm font-semibold ${
        ativo ? "border-carvao bg-carvao text-on-escuro" : "border-borda hover:border-carvao"
      }`}
    >
      {nome}
    </Link>
  );
}

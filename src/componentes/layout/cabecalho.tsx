import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BotaoSacola } from "@/componentes/sacola/botao-sacola";
import { CATEGORIAS } from "@/lib/catalogo/tipos";

const LINK_NAV = "inline-flex min-h-11 shrink-0 items-center whitespace-nowrap text-sm font-semibold hover:text-coral-texto";

export function Cabecalho() {
  return (
    <header className="sticky top-0 z-30 border-b border-linha bg-papel">
      <div className="conteudo flex items-center gap-4 py-2">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Belezer, página inicial">
          <Image src="/marca/logo-b.png" alt="" width={40} height={40} className="rounded-sm" priority />
          <span className="font-display text-[28px] leading-none">Belezer</span>
        </Link>

        <form action="/produtos" role="search" className="relative ml-auto hidden w-full max-w-sm md:block">
          <label htmlFor="busca-topo" className="sr-only">
            Buscar produtos
          </label>
          <input
            id="busca-topo"
            name="busca"
            type="search"
            placeholder="Buscar shampoo, máscara, linha..."
            className="min-h-11 w-full rounded-full border-[1.5px] border-borda bg-papel pl-4 pr-11"
          />
          <button
            type="submit"
            aria-label="Buscar"
            className="absolute right-0 top-0 inline-flex size-11 cursor-pointer items-center justify-center"
          >
            <Search size={20} strokeWidth={1.75} aria-hidden />
          </button>
        </form>

        <div className="ml-auto flex items-center md:ml-0">
          <Link
            href="/produtos"
            aria-label="Buscar produtos"
            className="inline-flex size-11 items-center justify-center rounded-full hover:bg-creme md:hidden"
          >
            <Search size={20} strokeWidth={1.75} aria-hidden />
          </Link>
          <BotaoSacola />
        </div>
      </div>

      <nav aria-label="Categorias" className="conteudo flex gap-6 overflow-x-auto">
        <Link href="/produtos" className={LINK_NAV}>
          Todos
        </Link>
        {Object.entries(CATEGORIAS).map(([slug, nome]) => (
          <Link key={slug} href={`/produtos?categoria=${slug}`} className={LINK_NAV}>
            {nome}
          </Link>
        ))}
        <Link href="/sobre" className={LINK_NAV}>
          A loja
        </Link>
      </nav>
    </header>
  );
}

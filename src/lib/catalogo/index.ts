import { cacheLife, cacheTag } from "next/cache";
import { bannerPadrao, LINHAS_DESCRICAO, produtosSemente } from "@/dados/catalogo-semente";
import { notionEnv } from "@/lib/env";
import { listarProdutosNotion, obterBannerNotion } from "./notion";
import type { Banner, FiltrosCatalogo, Linha, Produto } from "./tipos";

const VIDA_CACHE = { stale: 60, revalidate: 300, expire: 3600 };

export async function obterCatalogo(): Promise<Produto[]> {
  "use cache";
  cacheLife(VIDA_CACHE);
  cacheTag("catalogo");
  const env = notionEnv();
  return env ? listarProdutosNotion(env.token, env.produtos) : produtosSemente;
}

export async function obterBanner(): Promise<Banner> {
  "use cache";
  cacheLife(VIDA_CACHE);
  cacheTag("catalogo");
  const env = notionEnv();
  if (!env?.banners) return bannerPadrao;
  return (await obterBannerNotion(env.token, env.banners)) ?? bannerPadrao;
}

export async function obterProduto(slug: string) {
  return (await obterCatalogo()).find((produto) => produto.slug === slug);
}

export function agruparLinhas(produtos: Produto[]): Linha[] {
  const linhas = new Map<string, Linha>();
  for (const produto of produtos) {
    const atual = linhas.get(produto.linha);
    if (atual) {
      atual.total += 1;
    } else {
      linhas.set(produto.linha, {
        slug: produto.linha,
        nome: produto.linhaNome,
        descricao: LINHAS_DESCRICAO[produto.linha] ?? "",
        total: 1,
      });
    }
  }
  return [...linhas.values()];
}

const normalizar = (texto: string) =>
  texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

export function filtrarProdutos(produtos: Produto[], { categoria, linha, busca }: FiltrosCatalogo) {
  const termo = busca ? normalizar(busca.trim()) : "";
  return produtos.filter(
    (produto) =>
      (!categoria || produto.categoria === categoria) &&
      (!linha || produto.linha === linha) &&
      (!termo || normalizar(`${produto.nome} ${produto.linhaNome} ${produto.marca}`).includes(termo)),
  );
}

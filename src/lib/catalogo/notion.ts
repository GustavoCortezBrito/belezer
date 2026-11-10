import { Client, isFullPage } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client";
import { LINHAS_DESCRICAO } from "@/dados/catalogo-semente";
import { criarSlug } from "@/lib/formato";
import { CATEGORIAS, type Banner, type Categoria, type Produto } from "./tipos";

type Propriedades = PageObjectResponse["properties"];

const texto = (props: Propriedades, nome: string) => {
  const p = props[nome];
  if (p?.type === "title") return p.title.map((t) => t.plain_text).join("");
  if (p?.type === "rich_text") return p.rich_text.map((t) => t.plain_text).join("");
  if (p?.type === "url") return p.url ?? "";
  if (p?.type === "select") return p.select?.name ?? "";
  return "";
};

const numero = (props: Propriedades, nome: string) => {
  const p = props[nome];
  return p?.type === "number" && p.number !== null ? p.number : undefined;
};

const marcado = (props: Propriedades, nome: string) => {
  const p = props[nome];
  return p?.type === "checkbox" && p.checkbox;
};

const categoriaDe = (nome: string): Categoria | undefined =>
  (Object.keys(CATEGORIAS) as Categoria[]).find((c) => CATEGORIAS[c] === nome);

async function consultarAtivos(client: Client, dataSourceId: string) {
  const paginas: PageObjectResponse[] = [];
  let cursor: string | undefined;
  do {
    const resposta = await client.dataSources.query({
      data_source_id: dataSourceId,
      filter: { property: "Ativo", checkbox: { equals: true } },
      start_cursor: cursor,
      page_size: 100,
    });
    paginas.push(...resposta.results.filter(isFullPage));
    cursor = resposta.has_more ? (resposta.next_cursor ?? undefined) : undefined;
  } while (cursor);
  return paginas;
}

function paraProduto({ properties: p }: PageObjectResponse): Produto | null {
  const nome = texto(p, "Nome");
  const categoria = categoriaDe(texto(p, "Categoria"));
  const preco = numero(p, "Preço");
  const linhaNome = texto(p, "Linha");
  // Produto incompleto não vai para a vitrine, para nunca aparecer sem preço.
  if (!nome || !categoria || preco === undefined || !linhaNome) return null;

  const medida = texto(p, "Medida");
  const linha = criarSlug(linhaNome);
  const anterior = numero(p, "Preço anterior");
  return {
    slug: texto(p, "Slug") || criarSlug(`${nome} ${medida}`),
    nome,
    marca: texto(p, "Marca") || "Truss",
    linha,
    linhaNome,
    categoria,
    medida,
    precoCentavos: Math.round(preco * 100),
    precoAnteriorCentavos: anterior === undefined ? undefined : Math.round(anterior * 100),
    descricao: texto(p, "Descrição") || LINHAS_DESCRICAO[linha] || "",
    comoUsar: texto(p, "Como usar"),
    imagem: texto(p, "Imagem") || undefined,
    destaque: marcado(p, "Destaque"),
    novidade: marcado(p, "Novidade"),
    pesoGramas: numero(p, "Peso (g)") ?? 400,
  };
}

export async function listarProdutosNotion(token: string, dataSourceId: string) {
  const paginas = await consultarAtivos(new Client({ auth: token }), dataSourceId);
  return paginas.map(paraProduto).filter((produto) => produto !== null);
}

export async function obterBannerNotion(token: string, dataSourceId: string): Promise<Banner | null> {
  const paginas = await consultarAtivos(new Client({ auth: token }), dataSourceId);
  const ordenadas = paginas.sort((a, b) => (numero(a.properties, "Ordem") ?? 99) - (numero(b.properties, "Ordem") ?? 99));
  const primeira = ordenadas[0]?.properties;
  if (!primeira) return null;
  return {
    titulo: texto(primeira, "Título"),
    subtitulo: texto(primeira, "Subtítulo"),
    ctaTexto: texto(primeira, "Texto do botão") || "Ver produtos",
    ctaLink: texto(primeira, "Link do botão") || "/produtos",
    midia: texto(primeira, "Mídia") || undefined,
  };
}

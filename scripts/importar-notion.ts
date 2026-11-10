// Cria as bases "Produtos" e "Banners" no Notion e importa o catálogo inicial.
// Uso: npm run notion:importar (precisa de NOTION_TOKEN e NOTION_PAGE_ID no .env.local)
import { Client } from "@notionhq/client";
import { produtosSemente } from "../src/dados/catalogo-semente.ts";
import { CATEGORIAS } from "../src/lib/catalogo/tipos.ts";

const token = process.env.NOTION_TOKEN;
const pagina = process.env.NOTION_PAGE_ID;
if (!token || !pagina) {
  console.error("Defina NOTION_TOKEN e NOTION_PAGE_ID no .env.local.");
  process.exit(1);
}

const notion = new Client({ auth: token });
const esperar = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const texto = (content: string) => (content ? [{ type: "text" as const, text: { content } }] : []);

async function criarBase(titulo: string, properties: Record<string, object>) {
  const base = await notion.databases.create({
    parent: { type: "page_id", page_id: pagina! },
    title: texto(titulo),
    initial_data_source: { properties: properties as never },
  });
  if (!("data_sources" in base)) throw new Error("O Notion não retornou a fonte de dados.");
  return base.data_sources[0].id;
}

const produtos = await criarBase("Produtos", {
  Nome: { title: {} },
  Slug: { rich_text: {} },
  Marca: { select: {} },
  Linha: { select: {} },
  Categoria: { select: { options: Object.values(CATEGORIAS).map((name) => ({ name })) } },
  Medida: { rich_text: {} },
  Preço: { number: { format: "real" } },
  "Preço anterior": { number: { format: "real" } },
  Descrição: { rich_text: {} },
  "Como usar": { rich_text: {} },
  Imagem: { url: {} },
  "Peso (g)": { number: {} },
  Destaque: { checkbox: {} },
  Novidade: { checkbox: {} },
  Ativo: { checkbox: {} },
});

const banners = await criarBase("Banners", {
  Título: { title: {} },
  Subtítulo: { rich_text: {} },
  "Texto do botão": { rich_text: {} },
  "Link do botão": { url: {} },
  Mídia: { url: {} },
  Ordem: { number: {} },
  Ativo: { checkbox: {} },
});

for (const [indice, produto] of produtosSemente.entries()) {
  await notion.pages.create({
    parent: { type: "data_source_id", data_source_id: produtos },
    properties: {
      Nome: { title: texto(produto.nome) },
      Slug: { rich_text: texto(produto.slug) },
      Marca: { select: { name: produto.marca } },
      Linha: { select: { name: produto.linhaNome } },
      Categoria: { select: { name: CATEGORIAS[produto.categoria] } },
      Medida: { rich_text: texto(produto.medida) },
      Preço: { number: produto.precoCentavos / 100 },
      Descrição: { rich_text: texto(produto.descricao) },
      "Como usar": { rich_text: texto(produto.comoUsar) },
      "Peso (g)": { number: produto.pesoGramas },
      Destaque: { checkbox: produto.destaque },
      Novidade: { checkbox: produto.novidade },
      Ativo: { checkbox: true },
    },
  });
  console.log(`${indice + 1}/${produtosSemente.length} ${produto.nome} ${produto.medida}`);
  await esperar(350);
}

console.log("\nAdicione ao .env.local:");
console.log(`NOTION_PRODUTOS_ID=${produtos}`);
console.log(`NOTION_BANNERS_ID=${banners}`);

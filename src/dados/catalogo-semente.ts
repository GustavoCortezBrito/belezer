import type { Banner, Categoria, Produto } from "../lib/catalogo/tipos";

/**
 * Catálogo inicial, vindo da "Tabela Home Varejo" com acréscimo de 20%.
 * Depois de importado para o Notion, o preço de venda passa a ser editado lá.
 * Este arquivo não pode ter imports de runtime: ele também roda em scripts/importar-notion.ts.
 */
export const ACRESCIMO_PERCENTUAL = 20;

type LinhaTabela = {
  nome: string;
  descricao: string;
  itens: [nome: string, categoria: Categoria, medida: string, precoTabela: number][];
};

const TABELA: LinhaTabela[] = [
  {
    nome: "Miracle",
    descricao: "Tratamento intensivo para cabelos danificados.",
    itens: [
      ["Shampoo Miracle", "shampoo", "300 ml", 74.5],
      ["Condicionador Miracle", "condicionador", "300 ml", 90],
      ["Máscara Miracle", "mascara", "180 g", 113],
    ],
  },
  {
    nome: "Uso Obrigatório",
    descricao: "Reconstrução e proteção para a rotina dos fios.",
    itens: [
      ["Shampoo Uso Obrigatório", "shampoo", "300 ml", 74.5],
      ["Condicionador Uso Obrigatório", "condicionador", "300 ml", 90],
      ["Máscara Uso Obrigatório", "mascara", "180 g", 113],
      ["Uso Obrigatório", "finalizador", "260 ml", 88.6],
      ["Óleo Reconstrutor", "oleo", "60 ml", 90],
      ["Óleo Reconstrutor", "oleo", "30 ml", 55],
    ],
  },
  {
    nome: "Uso Obrigatório Blond",
    descricao: "Reconstrução pensada para cabelos loiros.",
    itens: [
      ["Shampoo Uso Obrigatório Blond", "shampoo", "300 ml", 74.5],
      ["Condicionador Uso Obrigatório Blond", "condicionador", "300 ml", 90],
      ["Máscara Uso Obrigatório Blond", "mascara", "180 g", 113],
      ["Uso Obrigatório Blond", "finalizador", "260 ml", 99.87],
    ],
  },
  {
    nome: "Nutri Infusion",
    descricao: "Nutrição para fios ressecados.",
    itens: [
      ["Shampoo Nutri Infusion", "shampoo", "300 ml", 74.5],
      ["Condicionador Nutri Infusion", "condicionador", "300 ml", 90],
      ["Máscara Nutri Infusion", "mascara", "180 g", 113],
      ["Óleo Nutritivo", "oleo", "60 ml", 85],
      ["Óleo Nutritivo", "oleo", "30 ml", 50],
    ],
  },
  {
    nome: "Blond Revolution",
    descricao: "Cuidado para cabelos loiros e descoloridos.",
    itens: [
      ["Shampoo Blond Revolution", "shampoo", "300 ml", 74.5],
      ["Net Blond Mask", "mascara", "180 g", 105],
      ["Impassable", "finalizador", "100 ml", 119.99],
    ],
  },
  {
    nome: "Frizz Zero",
    descricao: "Controle do frizz no dia a dia.",
    itens: [
      ["Shampoo Frizz Zero", "shampoo", "300 ml", 74.5],
      ["Condicionador Frizz Zero", "condicionador", "300 ml", 90],
      ["Frizz Zero", "finalizador", "260 ml", 99.87],
    ],
  },
  {
    nome: "Color Shield",
    descricao: "Proteção para cabelos coloridos.",
    itens: [
      ["Shampoo Color Shield", "shampoo", "300 ml", 74.5],
      ["Condicionador Color Shield", "condicionador", "300 ml", 90],
      ["Leave-in Color Shield", "finalizador", "200 ml", 93],
    ],
  },
  {
    nome: "Curly",
    descricao: "Definição e cuidado para cachos.",
    itens: [
      ["Shampoo Curly", "shampoo", "300 ml", 74.5],
      ["Condicionador Curly", "condicionador", "300 ml", 90],
      ["Curly Light", "finalizador", "250 ml", 95],
      ["Curly Fix", "finalizador", "250 ml", 95],
    ],
  },
  {
    nome: "Perfect",
    descricao: "Cuidado completo para os fios.",
    itens: [
      ["Shampoo Perfect", "shampoo", "300 ml", 74.5],
      ["Condicionador Perfect", "condicionador", "300 ml", 90],
      ["Máscara Perfect", "mascara", "180 g", 113],
    ],
  },
  {
    nome: "Ultra Hydration",
    descricao: "Hidratação para os fios.",
    itens: [
      ["Shampoo Ultra Hydration", "shampoo", "300 ml", 74.5],
      ["Condicionador Ultra Hydration", "condicionador", "300 ml", 90],
    ],
  },
  {
    nome: "Ultra Hydration Plus",
    descricao: "Hidratação reforçada para os fios.",
    itens: [
      ["Shampoo Ultra Hydration Plus", "shampoo", "300 ml", 74.5],
      ["Condicionador Ultra Hydration Plus", "condicionador", "300 ml", 90],
    ],
  },
  {
    nome: "Equilibrium Scalp",
    descricao: "Cuidado para o couro cabeludo.",
    itens: [
      ["Shampoo Equilibrium Scalp", "shampoo", "300 ml", 74.5],
      ["Condicionador Equilibrium Scalp", "condicionador", "300 ml", 90],
      ["Máscara Couro Cabeludo Equilibrium Scalp", "mascara", "150 g", 119],
    ],
  },
  {
    nome: "Structure",
    descricao: "Cuidado para a estrutura dos fios.",
    itens: [
      ["Shampoo Structure", "shampoo", "300 ml", 74.5],
      ["Condicionador Structure", "condicionador", "300 ml", 90],
    ],
  },
  {
    nome: "Stop Damage",
    descricao: "Cuidado para fios que passam por processos químicos.",
    itens: [
      ["Shampoo Stop Damage", "shampoo", "300 ml", 74.5],
      ["Máscara Stop Damage", "mascara", "180 g", 113],
    ],
  },
  {
    nome: "Therapy",
    descricao: "Shampoo de tratamento da Truss.",
    itens: [["Shampoo Therapy", "shampoo", "300 ml", 74.5]],
  },
  {
    nome: "Man Nature",
    descricao: "Cuidado para o cabelo masculino.",
    itens: [
      ["Shampoo Man Nature", "shampoo", "300 ml", 74.5],
      ["Condicionador Man Nature", "condicionador", "300 ml", 90],
    ],
  },
  {
    nome: "Tamanho profissional",
    descricao: "Embalagens de 1 litro para quem usa todo dia.",
    itens: [
      ["Shampoo Basic", "shampoo", "1 L", 129.99],
      ["Shampoo Color Shield", "shampoo", "1 L", 189.99],
      ["Shampoo Equilibrium", "shampoo", "1 L", 189.99],
      ["Shampoo Nutri Infusion", "shampoo", "1 L", 189.99],
      ["Shampoo Uso Obrigatório", "shampoo", "1 L", 189.99],
      ["Condicionador Basic", "condicionador", "1 L", 149.99],
      ["Condicionador Color Shield", "condicionador", "1 L", 209.99],
      ["Condicionador Equilibrium", "condicionador", "1 L", 209.99],
      ["Condicionador Nutri Infusion", "condicionador", "1 L", 209.99],
      ["Condicionador Uso Obrigatório", "condicionador", "1 L", 209.99],
    ],
  },
  {
    nome: "Tratamentos especiais",
    descricao: "Máscaras, séruns e kits para momentos específicos.",
    itens: [
      ["Specific Mask", "mascara", "180 g", 113],
      ["Net Mask", "mascara", "550 g", 198.22],
      ["Night SPA", "finalizador", "250 ml", 109],
      ["Shock Repair", "finalizador", "", 137.99],
      ["Kit Crazy For Truss", "kit", "", 140],
    ],
  },
  {
    nome: "Finalizadores",
    descricao: "Proteção, forma e brilho na última etapa.",
    itens: [
      ["Amino", "finalizador", "225 ml", 150],
      ["Fluid Fix", "finalizador", "250 ml", 97],
      ["Body Volume", "finalizador", "250 ml", 73.21],
      ["Brush Keratin", "finalizador", "250 ml", 95],
      ["Hair Protector", "finalizador", "250 ml", 109],
      ["Day by Day", "finalizador", "250 ml", 75],
      ["Beach Waves", "finalizador", "260 ml", 103],
      ["Illuminatte Oil", "oleo", "60 ml", 81],
    ],
  },
  {
    nome: "Styling Fix",
    descricao: "Fixação e modelagem para o penteado.",
    itens: [
      ["Sculpt Fix", "finalizador", "500 ml", 106.41],
      ["Shine Fix", "finalizador", "450 ml", 106.41],
      ["Stay Fix Medium", "finalizador", "450 ml", 106.41],
      ["Stay Fix Strong", "finalizador", "450 ml", 106.41],
      ["Mousse Fix", "finalizador", "350 ml", 85.13],
    ],
  },
];

const COMO_USAR: Record<Categoria, string> = {
  shampoo: "Aplique nos fios molhados, massageie o couro cabeludo e enxágue.",
  condicionador: "Depois do shampoo, aplique nos comprimentos e pontas e enxágue.",
  mascara: "Aplique nos fios úmidos, deixe agir conforme a embalagem e enxágue.",
  finalizador: "Siga as orientações da embalagem. Na dúvida, fale com a nossa equipe.",
  oleo: "Aplique poucas gotas nos comprimentos e pontas.",
  kit: "Use cada produto conforme a orientação da embalagem.",
};

const DESTAQUES = new Set([
  "shampoo-miracle-300-ml",
  "mascara-miracle-180-g",
  "mascara-nutri-infusion-180-g",
  "uso-obrigatorio-260-ml",
  "frizz-zero-260-ml",
  "net-blond-mask-180-g",
  "curly-light-250-ml",
  "leave-in-color-shield-200-ml",
]);

const slug = (texto: string) =>
  texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Peso de envio estimado a partir da medida do produto. */
const estimarPeso = (medida: string, categoria: Categoria) => {
  if (categoria === "kit") return 900;
  const litro = medida.match(/^([\d.]+) L$/);
  const valor = litro ? Number(litro[1]) * 1000 : Number.parseFloat(medida);
  return Number.isNaN(valor) ? 350 : Math.round(valor * 1.15 + 40);
};

export const precoComAcrescimo = (precoTabela: number) =>
  Math.round(precoTabela * 100 * (1 + ACRESCIMO_PERCENTUAL / 100));

export const LINHAS_DESCRICAO: Record<string, string> = Object.fromEntries(
  TABELA.map((linha) => [slug(linha.nome), linha.descricao]),
);

export const produtosSemente: Produto[] = TABELA.flatMap((linha) =>
  linha.itens.map(([nome, categoria, medida, precoTabela]) => {
    const produtoSlug = slug(`${nome} ${medida}`);
    return {
      slug: produtoSlug,
      nome,
      marca: "Truss",
      linha: slug(linha.nome),
      linhaNome: linha.nome,
      categoria,
      medida,
      precoCentavos: precoComAcrescimo(precoTabela),
      descricao: `Produto Truss da linha ${linha.nome}. ${linha.descricao}`,
      comoUsar: COMO_USAR[categoria],
      destaque: DESTAQUES.has(produtoSlug),
      novidade: linha.nome === "Color Shield",
      pesoGramas: estimarPeso(medida, categoria),
    };
  }),
);

export const bannerPadrao: Banner = {
  titulo: "Beleza em todas as formas",
  subtitulo: "A linha completa da Truss e o atendimento da loja de Barretos, agora também na sua casa.",
  ctaTexto: "Ver produtos Truss",
  ctaLink: "/produtos",
};

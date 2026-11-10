export const CATEGORIAS = {
  shampoo: "Shampoos",
  condicionador: "Condicionadores",
  mascara: "Máscaras",
  finalizador: "Finalizadores",
  oleo: "Óleos",
  kit: "Kits",
} as const;

export type Categoria = keyof typeof CATEGORIAS;

export type Produto = {
  slug: string;
  nome: string;
  marca: string;
  linha: string;
  linhaNome: string;
  categoria: Categoria;
  medida: string;
  precoCentavos: number;
  precoAnteriorCentavos?: number;
  descricao: string;
  comoUsar: string;
  imagem?: string;
  destaque: boolean;
  novidade: boolean;
  pesoGramas: number;
};

export type Linha = {
  slug: string;
  nome: string;
  descricao: string;
  total: number;
};

export type Banner = {
  titulo: string;
  subtitulo: string;
  ctaTexto: string;
  ctaLink: string;
  midia?: string;
};

export type FiltrosCatalogo = {
  categoria?: string;
  linha?: string;
  busca?: string;
};

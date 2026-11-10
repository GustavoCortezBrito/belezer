const reais = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export const formatarPreco = (centavos: number) => reais.format(centavos / 100);

export const criarSlug = (texto: string) =>
  texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const somenteDigitos = (texto: string) => texto.replace(/\D/g, "");

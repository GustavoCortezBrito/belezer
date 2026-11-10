import "server-only";
import { z } from "zod";
import { obterCatalogo } from "@/lib/catalogo";
import { obterEstoque } from "@/lib/estoque";
import { cotarFrete, OPCAO_RETIRADA, type ItemFrete } from "@/lib/frete";
import { somenteDigitos } from "@/lib/formato";
import { criarPreferencia, pagamentoConfigurado, type ItemPagamento } from "@/lib/pagamento/mercado-pago";
import { criarSupabase } from "@/lib/supabase";

const cep = z.string().transform(somenteDigitos).pipe(z.string().length(8, "Informe um CEP com 8 números."));

export const itensSchema = z
  .array(z.object({ slug: z.string().min(1), quantidade: z.number().int().min(1).max(20) }))
  .min(1, "Sua sacola está vazia.")
  .max(50);

export const cotacaoSchema = z.object({ cep, itens: itensSchema });

const enderecoSchema = z.object({
  cep,
  rua: z.string().trim().min(2, "Informe a rua."),
  numero: z.string().trim().min(1, "Informe o número."),
  complemento: z.string().trim().max(80).optional(),
  bairro: z.string().trim().min(2, "Informe o bairro."),
  cidade: z.string().trim().min(2, "Informe a cidade."),
  uf: z.string().trim().length(2, "Informe a UF com 2 letras.").toUpperCase(),
});

export const pedidoSchema = z
  .object({
    nome: z.string().trim().min(3, "Informe seu nome completo.").max(120),
    email: z.email("Informe um e-mail válido."),
    telefone: z.string().transform(somenteDigitos).pipe(z.string().min(10, "Informe o telefone com DDD.").max(13)),
    opcaoFrete: z.string().min(1, "Escolha como receber o pedido."),
    endereco: enderecoSchema.optional(),
    itens: itensSchema,
  })
  .refine((pedido) => pedido.opcaoFrete === OPCAO_RETIRADA.id || pedido.endereco, {
    message: "Informe o endereço de entrega.",
    path: ["endereco"],
  });

export type EntradaPedido = z.infer<typeof pedidoSchema>;

/** Erro com mensagem que pode ser mostrada à cliente. */
export class ErroPedido extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

/** Junta os itens da sacola ao catálogo. O preço sempre vem do servidor. */
export async function resolverItens(itens: { slug: string; quantidade: number }[]): Promise<ItemFrete[]> {
  const catalogo = new Map((await obterCatalogo()).map((produto) => [produto.slug, produto]));
  return itens.map(({ slug, quantidade }) => {
    const produto = catalogo.get(slug);
    if (!produto) throw new ErroPedido("Um dos produtos da sacola não está mais disponível. Remova-o e tente de novo.", 409);
    return { produto, quantidade };
  });
}

export async function criarPedido(entrada: EntradaPedido) {
  const supabase = criarSupabase();
  if (!supabase || !pagamentoConfigurado()) {
    throw new ErroPedido("As compras pelo site ainda não estão abertas. Fale com a gente pelo WhatsApp.", 503);
  }

  const itens = await resolverItens(entrada.itens);

  const estoque = await obterEstoque(itens.map(({ produto }) => produto.slug));
  for (const { produto, quantidade } of itens) {
    const disponivel = estoque.get(produto.slug);
    if (disponivel !== undefined && disponivel < quantidade) {
      throw new ErroPedido(
        disponivel === 0
          ? `${produto.nome} esgotou. Remova da sacola para continuar.`
          : `Temos só ${disponivel} unidade(s) de ${produto.nome}. Ajuste a quantidade para continuar.`,
        409,
      );
    }
  }

  // O frete é cotado de novo aqui para o valor não depender do navegador.
  const opcoes = entrada.opcaoFrete === OPCAO_RETIRADA.id ? [OPCAO_RETIRADA] : await cotarFrete(entrada.endereco!.cep, itens);
  const frete = opcoes.find((opcao) => opcao.id === entrada.opcaoFrete);
  if (!frete) throw new ErroPedido("Essa opção de frete não está mais disponível. Calcule o frete de novo.", 409);

  const subtotal = itens.reduce((soma, { produto, quantidade }) => soma + produto.precoCentavos * quantidade, 0);

  const { data: pedido, error } = await supabase
    .from("pedidos")
    .insert({
      nome: entrada.nome,
      email: entrada.email,
      telefone: entrada.telefone,
      frete_id: frete.id,
      frete_nome: frete.nome,
      frete_centavos: frete.centavos,
      endereco: frete.id === OPCAO_RETIRADA.id ? null : entrada.endereco,
      subtotal_centavos: subtotal,
      total_centavos: subtotal + frete.centavos,
    })
    .select("id")
    .single();
  if (error) throw new Error(`Falha ao criar o pedido: ${error.message}`);

  try {
    const { error: erroItens } = await supabase.from("itens_pedido").insert(
      itens.map(({ produto, quantidade }) => ({
        pedido_id: pedido.id,
        slug: produto.slug,
        nome: [produto.nome, produto.medida].filter(Boolean).join(" "),
        preco_centavos: produto.precoCentavos,
        quantidade,
      })),
    );
    if (erroItens) throw new Error(`Falha ao gravar os itens: ${erroItens.message}`);

    const cobranca: ItemPagamento[] = itens.map(({ produto, quantidade }) => ({
      id: produto.slug,
      titulo: [produto.nome, produto.medida].filter(Boolean).join(" "),
      quantidade,
      centavos: produto.precoCentavos,
    }));
    if (frete.centavos > 0) {
      cobranca.push({ id: "frete", titulo: `Frete ${frete.nome}`, quantidade: 1, centavos: frete.centavos });
    }

    const preferencia = await criarPreferencia(pedido.id, entrada.email, cobranca);
    await supabase.from("pedidos").update({ preferencia_id: preferencia.id }).eq("id", pedido.id);
    return { pedidoId: pedido.id as string, urlPagamento: preferencia.url };
  } catch (erro) {
    await supabase.from("pedidos").delete().eq("id", pedido.id);
    throw erro;
  }
}

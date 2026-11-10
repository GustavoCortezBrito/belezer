import "server-only";
import { melhorEnvioEnv } from "@/lib/env";
import type { Produto } from "@/lib/catalogo/tipos";
import { OPCAO_RETIRADA, type OpcaoFrete } from "@/lib/retirada";

export { OPCAO_RETIRADA };

export type ItemFrete = { produto: Produto; quantidade: number };

type ServicoMelhorEnvio = {
  id: number;
  name: string;
  price?: string;
  custom_price?: string;
  custom_delivery_time?: number;
  delivery_time?: number;
  error?: string;
  company?: { name: string };
};

/** Dimensões estimadas da embalagem em cm, a partir do peso do produto. */
const dimensoes = (pesoGramas: number) => {
  if (pesoGramas <= 120) return { width: 5, height: 12, length: 5 };
  if (pesoGramas <= 420) return { width: 7, height: 19, length: 7 };
  if (pesoGramas <= 700) return { width: 10, height: 20, length: 10 };
  return { width: 11, height: 26, length: 11 };
};

export async function cotarFrete(cep: string, itens: ItemFrete[]): Promise<OpcaoFrete[]> {
  const env = melhorEnvioEnv();
  if (!env) return [OPCAO_RETIRADA];

  const resposta = await fetch(`${env.url}/api/v2/me/shipment/calculate`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.token}`,
      "User-Agent": env.userAgent,
    },
    body: JSON.stringify({
      from: { postal_code: env.cepOrigem },
      to: { postal_code: cep },
      products: itens.map(({ produto, quantidade }) => ({
        id: produto.slug,
        ...dimensoes(produto.pesoGramas),
        weight: produto.pesoGramas / 1000,
        insurance_value: produto.precoCentavos / 100,
        quantity: quantidade,
      })),
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!resposta.ok) throw new Error(`Melhor Envio respondeu ${resposta.status}`);

  const servicos = (await resposta.json()) as ServicoMelhorEnvio[];
  const opcoes = servicos.flatMap((servico): OpcaoFrete[] => {
    const preco = Number(servico.custom_price ?? servico.price);
    if (servico.error || !Number.isFinite(preco)) return [];
    const dias = servico.custom_delivery_time ?? servico.delivery_time;
    return [
      {
        id: String(servico.id),
        nome: [servico.company?.name, servico.name].filter(Boolean).join(" "),
        prazo: dias ? `Até ${dias} dias úteis` : "Prazo informado após a postagem",
        centavos: Math.round(preco * 100),
      },
    ];
  });
  return [OPCAO_RETIRADA, ...opcoes.sort((a, b) => a.centavos - b.centavos)];
}

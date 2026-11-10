import "server-only";
import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import { mercadoPagoEnv, siteUrl } from "@/lib/env";

export type ItemPagamento = { id: string; titulo: string; quantidade: number; centavos: number };

const configurar = () => {
  const env = mercadoPagoEnv();
  return env ? new MercadoPagoConfig({ accessToken: env.token }) : null;
};

export const pagamentoConfigurado = () => mercadoPagoEnv() !== null;

export async function criarPreferencia(pedidoId: string, email: string, itens: ItemPagamento[]) {
  const config = configurar();
  if (!config) throw new Error("Mercado Pago não configurado");

  const urlPedido = `${siteUrl}/pedido/${pedidoId}`;
  // O Mercado Pago só aceita retorno automático e webhook em endereços https.
  const publico = siteUrl.startsWith("https://");

  const preferencia = await new Preference(config).create({
    body: {
      external_reference: pedidoId,
      payer: { email },
      items: itens.map((item) => ({
        id: item.id,
        title: item.titulo,
        quantity: item.quantidade,
        unit_price: item.centavos / 100,
        currency_id: "BRL",
      })),
      back_urls: { success: urlPedido, pending: urlPedido, failure: urlPedido },
      ...(publico && {
        auto_return: "approved",
        notification_url: `${siteUrl}/api/webhooks/mercado-pago`,
      }),
    },
  });
  if (!preferencia.id || !preferencia.init_point) throw new Error("Mercado Pago não retornou o link de pagamento");
  return { id: preferencia.id, url: preferencia.init_point };
}

export async function buscarPagamento(id: string) {
  const config = configurar();
  if (!config) throw new Error("Mercado Pago não configurado");
  return new Payment(config).get({ id });
}

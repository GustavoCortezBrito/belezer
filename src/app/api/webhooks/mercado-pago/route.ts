import { NextResponse, type NextRequest } from "next/server";
import { mercadoPagoEnv } from "@/lib/env";
import { assinaturaValida } from "@/lib/pagamento/assinatura";
import { buscarPagamento } from "@/lib/pagamento/mercado-pago";
import { criarSupabase } from "@/lib/supabase";

const STATUS_CANCELAMENTO = new Set(["cancelled", "refunded", "charged_back"]);

export async function POST(request: NextRequest) {
  const env = mercadoPagoEnv();
  const supabase = criarSupabase();
  if (!env?.segredoWebhook || !supabase) {
    return NextResponse.json({ erro: "Webhook não configurado" }, { status: 503 });
  }

  const dataId = request.nextUrl.searchParams.get("data.id");
  const valido = assinaturaValida({
    assinatura: request.headers.get("x-signature"),
    requestId: request.headers.get("x-request-id"),
    dataId,
    segredo: env.segredoWebhook,
  });
  if (!valido) return NextResponse.json({ erro: "Assinatura inválida" }, { status: 401 });

  if (request.nextUrl.searchParams.get("type") !== "payment") {
    return NextResponse.json({ ok: true });
  }

  // O status vem sempre da API do Mercado Pago, nunca do corpo da notificação.
  const pagamento = await buscarPagamento(dataId!);
  const pedidoId = pagamento.external_reference;
  if (!pedidoId) return NextResponse.json({ ok: true });

  const { data: pedido, error } = await supabase
    .from("pedidos")
    .select("id, total_centavos")
    .eq("id", pedidoId)
    .maybeSingle();
  if (error) throw new Error(`Falha ao consultar o pedido: ${error.message}`);
  if (!pedido) return NextResponse.json({ ok: true });

  if (pagamento.status === "approved") {
    const pago = Math.round((pagamento.transaction_amount ?? 0) * 100);
    if (pago !== pedido.total_centavos) {
      console.error(`Valor divergente no pedido ${pedido.id}: pago ${pago}, esperado ${pedido.total_centavos}`);
      return NextResponse.json({ ok: true });
    }
    const { error: erroConfirmacao } = await supabase.rpc("confirmar_pagamento", {
      p_pedido: pedido.id,
      p_pagamento: String(pagamento.id),
    });
    if (erroConfirmacao) throw new Error(`Falha ao confirmar o pagamento: ${erroConfirmacao.message}`);
  } else if (pagamento.status && STATUS_CANCELAMENTO.has(pagamento.status)) {
    const { error: erroCancelamento } = await supabase
      .from("pedidos")
      .update({ status: "cancelado" })
      .eq("id", pedido.id);
    if (erroCancelamento) throw new Error(`Falha ao cancelar o pedido: ${erroCancelamento.message}`);
  }

  return NextResponse.json({ ok: true });
}

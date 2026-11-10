import { NextResponse } from "next/server";
import { criarPedido, ErroPedido, pedidoSchema } from "@/lib/pedidos";

export async function POST(request: Request) {
  const corpo = pedidoSchema.safeParse(await request.json().catch(() => null));
  if (!corpo.success) {
    return NextResponse.json({ erro: corpo.error.issues[0].message }, { status: 400 });
  }

  try {
    return NextResponse.json(await criarPedido(corpo.data), { status: 201 });
  } catch (erro) {
    if (erro instanceof ErroPedido) {
      return NextResponse.json({ erro: erro.message }, { status: erro.status });
    }
    console.error("Falha ao criar pedido", erro);
    return NextResponse.json({ erro: "Não conseguimos registrar seu pedido. Tente de novo em instantes." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { cotarFrete } from "@/lib/frete";
import { cotacaoSchema, ErroPedido, resolverItens } from "@/lib/pedidos";

export async function POST(request: Request) {
  const corpo = cotacaoSchema.safeParse(await request.json().catch(() => null));
  if (!corpo.success) {
    return NextResponse.json({ erro: corpo.error.issues[0].message }, { status: 400 });
  }

  try {
    const itens = await resolverItens(corpo.data.itens);
    return NextResponse.json({ opcoes: await cotarFrete(corpo.data.cep, itens) });
  } catch (erro) {
    if (erro instanceof ErroPedido) {
      return NextResponse.json({ erro: erro.message }, { status: erro.status });
    }
    console.error("Falha ao cotar frete", erro);
    return NextResponse.json({ erro: "Não conseguimos calcular o frete agora. Tente de novo em instantes." }, { status: 502 });
  }
}

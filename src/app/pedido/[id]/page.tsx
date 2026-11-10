import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LimparSacola } from "@/componentes/sacola/limpar-sacola";
import { classesBotao } from "@/componentes/ui/botao";
import { loja } from "@/config/loja";
import { formatarPreco } from "@/lib/formato";
import { criarSupabase } from "@/lib/supabase";

export const metadata: Metadata = { title: "Seu pedido", robots: { index: false } };

const STATUS = {
  aguardando_pagamento: {
    titulo: "Estamos aguardando o pagamento",
    texto: "Assim que o Mercado Pago confirmar, começamos a separar o seu pedido. Pagamentos com Pix costumam ser confirmados em minutos.",
  },
  pago: {
    titulo: "Pagamento confirmado",
    texto: "Agradecemos a compra. Já estamos separando o seu pedido.",
  },
  cancelado: {
    titulo: "Pedido cancelado",
    texto: "Este pedido foi cancelado. Se precisar de ajuda, fale com a gente pelo WhatsApp.",
  },
} as const;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function PaginaPedido({ params }: PageProps<"/pedido/[id]">) {
  return (
    <div className="conteudo max-w-2xl! py-12 md:py-24">
      <Suspense fallback={<p className="text-center text-carvao-suave">Carregando seu pedido...</p>}>
        <Pedido params={params} />
      </Suspense>
    </div>
  );
}

async function Pedido({ params }: { params: PageProps<"/pedido/[id]">["params"] }) {
  const { id } = await params;
  const supabase = criarSupabase();
  if (!supabase || !UUID.test(id)) notFound();

  const { data: pedido, error } = await supabase
    .from("pedidos")
    .select("status, frete_nome, frete_centavos, total_centavos, itens_pedido (id, nome, quantidade, preco_centavos)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Falha ao consultar o pedido: ${error.message}`);
  if (!pedido) notFound();

  const status = STATUS[pedido.status as keyof typeof STATUS];

  return (
    <>
      <LimparSacola />
      <h1 className="display-lg">{status.titulo}</h1>
      <p className="mt-4">{status.texto}</p>

      <ul className="mt-8 divide-y divide-linha border-y border-linha">
        {pedido.itens_pedido.map((item) => (
          <li key={item.id} className="flex justify-between gap-4 py-3">
            <span>
              {item.quantidade}x {item.nome}
            </span>
            <span className="tabular-nums">{formatarPreco(item.preco_centavos * item.quantidade)}</span>
          </li>
        ))}
        <li className="flex justify-between gap-4 py-3">
          <span>{pedido.frete_nome}</span>
          <span className="tabular-nums">{pedido.frete_centavos === 0 ? "Grátis" : formatarPreco(pedido.frete_centavos)}</span>
        </li>
      </ul>
      <p className="mt-4 flex items-baseline justify-between">
        <span className="font-semibold">Total</span>
        <span className="texto-preco">{formatarPreco(pedido.total_centavos)}</span>
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <a href={loja.whatsappUrl} className={classesBotao("escuro")}>
          Falar no WhatsApp
        </a>
        <Link href="/produtos" className={classesBotao("contorno")}>
          Continuar comprando
        </Link>
      </div>
    </>
  );
}

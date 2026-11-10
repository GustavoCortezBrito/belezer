"use client";

import { CircleAlert } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent, type InputHTMLAttributes } from "react";
import { subtotalCentavos, useSacola } from "@/componentes/sacola/loja-sacola";
import { classesBotao } from "@/componentes/ui/botao";
import { formatarPreco, somenteDigitos } from "@/lib/formato";
import { OPCAO_RETIRADA, type OpcaoFrete } from "@/lib/retirada";

function Campo({ id, rotulo, ...props }: { id: string; rotulo: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold">
        {rotulo}
      </label>
      <input
        id={id}
        name={id}
        className="min-h-12 w-full rounded-md border-[1.5px] border-borda bg-papel px-4"
        {...props}
      />
    </div>
  );
}

function Erro({ children }: { children: string }) {
  return (
    <p role="alert" className="flex items-start gap-2 text-sm text-erro">
      <CircleAlert size={20} strokeWidth={1.75} aria-hidden className="shrink-0" />
      {children}
    </p>
  );
}

export function FormularioCheckout() {
  const itens = useSacola((estado) => estado.itens);
  const [cep, setCep] = useState("");
  const [opcoes, setOpcoes] = useState<OpcaoFrete[]>([OPCAO_RETIRADA]);
  const [opcaoId, setOpcaoId] = useState(OPCAO_RETIRADA.id);
  const [calculando, setCalculando] = useState(false);
  const [erroFrete, setErroFrete] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  if (itens.length === 0) {
    return (
      <div className="py-16 text-center">
        <p>Sua sacola está vazia. Comece pela seleção Truss.</p>
        <Link href="/produtos" className={`${classesBotao("contorno")} mt-6`}>
          Ver produtos
        </Link>
      </div>
    );
  }

  const itensPedido = itens.map(({ slug, quantidade }) => ({ slug, quantidade }));
  const opcao = opcoes.find((o) => o.id === opcaoId) ?? OPCAO_RETIRADA;
  const subtotal = subtotalCentavos(itens);
  const entrega = opcao.id !== OPCAO_RETIRADA.id;

  async function calcularFrete() {
    setErroFrete("");
    if (somenteDigitos(cep).length !== 8) {
      setErroFrete("Informe um CEP com 8 números.");
      return;
    }
    setCalculando(true);
    try {
      const resposta = await fetch("/api/frete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cep, itens: itensPedido }),
      });
      const dados = await resposta.json();
      if (!resposta.ok) {
        setErroFrete(dados.erro);
        return;
      }
      setOpcoes(dados.opcoes);
      if (dados.opcoes.length === 1) {
        setErroFrete("A entrega ainda não está disponível para este CEP. Você pode retirar na loja.");
      }
    } catch {
      setErroFrete("Não conseguimos calcular o frete. Confira sua conexão e tente de novo.");
    } finally {
      setCalculando(false);
    }
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro("");
    setEnviando(true);
    const campos = Object.fromEntries(new FormData(evento.currentTarget)) as Record<string, string>;
    try {
      const resposta = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: campos.nome,
          email: campos.email,
          telefone: campos.telefone,
          opcaoFrete: opcao.id,
          itens: itensPedido,
          endereco: entrega
            ? {
                cep,
                rua: campos.rua,
                numero: campos.numero,
                complemento: campos.complemento || undefined,
                bairro: campos.bairro,
                cidade: campos.cidade,
                uf: campos.uf,
              }
            : undefined,
        }),
      });
      const dados = await resposta.json();
      if (!resposta.ok) {
        setErro(dados.erro);
        setEnviando(false);
        return;
      }
      window.location.assign(dados.urlPagamento);
    } catch {
      setErro("Não conseguimos registrar seu pedido. Confira sua conexão e tente de novo.");
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="grid items-start gap-8 lg:grid-cols-[1fr_380px] lg:gap-12">
      <div className="min-w-0 space-y-10">
        <fieldset className="space-y-4">
          <legend className="texto-titulo mb-4">Seus dados</legend>
          <Campo id="nome" rotulo="Nome completo" autoComplete="name" required />
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo id="email" rotulo="E-mail" type="email" autoComplete="email" required />
            <Campo id="telefone" rotulo="Telefone com DDD" type="tel" autoComplete="tel" required />
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="texto-titulo mb-4">Entrega</legend>
          <div className="flex items-end gap-2">
            <div className="min-w-0 flex-1">
              <Campo
                id="cep"
                rotulo="CEP"
                inputMode="numeric"
                autoComplete="postal-code"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
              />
            </div>
            <button type="button" onClick={calcularFrete} disabled={calculando} className={classesBotao("contorno")}>
              {calculando ? "Calculando" : "Calcular"}
            </button>
          </div>
          {erroFrete && <Erro>{erroFrete}</Erro>}

          <div className="space-y-2">
            {opcoes.map((o) => (
              <label
                key={o.id}
                className={`flex cursor-pointer items-center gap-3 rounded-md border-[1.5px] p-4 ${
                  o.id === opcao.id ? "border-carvao bg-creme" : "border-linha"
                }`}
              >
                <input
                  type="radio"
                  name="opcao"
                  checked={o.id === opcao.id}
                  onChange={() => setOpcaoId(o.id)}
                  className="size-5 accent-carvao"
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{o.nome}</span>
                  <span className="block text-sm text-carvao-suave">{o.prazo}</span>
                </span>
                <span className="font-semibold tabular-nums">{o.centavos === 0 ? "Grátis" : formatarPreco(o.centavos)}</span>
              </label>
            ))}
          </div>

          {entrega && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
                <Campo id="rua" rotulo="Rua" autoComplete="address-line1" required />
                <Campo id="numero" rotulo="Número" required />
              </div>
              <Campo id="complemento" rotulo="Complemento (opcional)" autoComplete="address-line2" />
              <div className="grid gap-4 sm:grid-cols-[1fr_1fr_80px]">
                <Campo id="bairro" rotulo="Bairro" required />
                <Campo id="cidade" rotulo="Cidade" autoComplete="address-level2" required />
                <Campo id="uf" rotulo="UF" maxLength={2} autoComplete="address-level1" required />
              </div>
            </div>
          )}
        </fieldset>
      </div>

      <aside className="space-y-4 rounded-md bg-creme p-6 lg:sticky lg:top-32">
        <h2 className="texto-titulo">Resumo do pedido</h2>
        <ul className="space-y-2 text-sm">
          {itens.map((item) => (
            <li key={item.slug} className="flex justify-between gap-4">
              <span className="min-w-0">
                {item.quantidade}x {[item.nome, item.medida].filter(Boolean).join(" ")}
              </span>
              <span className="tabular-nums">{formatarPreco(item.precoCentavos * item.quantidade)}</span>
            </li>
          ))}
        </ul>
        <dl className="space-y-1 border-t border-linha pt-4">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd className="tabular-nums">{formatarPreco(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Frete</dt>
            <dd className="tabular-nums">{opcao.centavos === 0 ? "Grátis" : formatarPreco(opcao.centavos)}</dd>
          </div>
          <div className="flex items-baseline justify-between pt-2">
            <dt className="font-semibold">Total</dt>
            <dd className="texto-preco">{formatarPreco(subtotal + opcao.centavos)}</dd>
          </div>
        </dl>
        {erro && <Erro>{erro}</Erro>}
        <button type="submit" disabled={enviando} className={classesBotao("escuro", "w-full")}>
          {enviando ? "Registrando pedido" : "Ir para o pagamento"}
        </button>
        <p className="text-sm text-carvao-suave">Você paga com Pix ou cartão no ambiente seguro do Mercado Pago.</p>
      </aside>
    </form>
  );
}

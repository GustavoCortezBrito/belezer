export type OpcaoFrete = {
  id: string;
  nome: string;
  prazo: string;
  centavos: number;
};

export const OPCAO_RETIRADA: OpcaoFrete = {
  id: "retirada",
  nome: "Retirar na loja em Barretos",
  prazo: "Avisamos quando o pedido estiver separado",
  centavos: 0,
};

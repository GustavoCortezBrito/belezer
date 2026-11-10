import { createHmac, timingSafeEqual } from "node:crypto";

/** Valida o cabeçalho x-signature enviado pelo Mercado Pago nos webhooks. */
export function assinaturaValida(params: {
  assinatura: string | null;
  requestId: string | null;
  dataId: string | null;
  segredo: string;
}) {
  const { assinatura, requestId, dataId, segredo } = params;
  if (!assinatura || !requestId || !dataId) return false;

  const partes = Object.fromEntries(assinatura.split(",").map((parte) => parte.trim().split("=", 2)));
  if (!partes.ts || !partes.v1) return false;

  const manifesto = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${partes.ts};`;
  const esperado = createHmac("sha256", segredo).update(manifesto).digest();
  const recebido = Buffer.from(partes.v1, "hex");
  return recebido.length === esperado.length && timingSafeEqual(recebido, esperado);
}

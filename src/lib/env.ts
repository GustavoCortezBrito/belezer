/** Integrações opcionais: sem as variáveis, o site roda com o catálogo local e sem checkout. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const notionEnv = () => {
  const token = process.env.NOTION_TOKEN;
  const produtos = process.env.NOTION_PRODUTOS_ID;
  return token && produtos ? { token, produtos, banners: process.env.NOTION_BANNERS_ID } : null;
};

export const supabaseEnv = () => {
  const url = process.env.SUPABASE_URL;
  const chave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && chave ? { url, chave } : null;
};

export const mercadoPagoEnv = () => {
  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  return token ? { token, segredoWebhook: process.env.MERCADO_PAGO_WEBHOOK_SECRET } : null;
};

export const melhorEnvioEnv = () => {
  const token = process.env.MELHOR_ENVIO_TOKEN;
  const cepOrigem = process.env.MELHOR_ENVIO_CEP_ORIGEM;
  const userAgent = process.env.MELHOR_ENVIO_USER_AGENT;
  if (!token || !cepOrigem || !userAgent) return null;
  return {
    token,
    cepOrigem,
    userAgent,
    url: process.env.MELHOR_ENVIO_URL ?? "https://melhorenvio.com.br",
  };
};

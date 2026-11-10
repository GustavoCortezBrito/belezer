# Belezer

E-commerce da Belezer: Next.js, Tailwind e Framer Motion, com catálogo no Notion e pedidos no Supabase.

## Rodar

```bash
npm install
cp .env.example .env.local
npm run dev
```

Sem variáveis, o site abre com o catálogo local e o checkout fica fechado.

## Ativar as integrações

1. **Supabase:** rode `supabase/migrations/0001_pedidos_estoque.sql` no SQL Editor e preencha as variáveis.
2. **Notion:** crie uma integração, compartilhe uma página com ela, defina `NOTION_TOKEN` e `NOTION_PAGE_ID` e rode `npm run notion:importar`. Copie os IDs impressos para o `.env.local`.
3. **Mercado Pago:** preencha o token e o segredo do webhook. Cadastre `/api/webhooks/mercado-pago` para eventos de pagamento.
4. **Melhor Envio:** preencha token, CEP de origem e User-Agent.

## Estrutura

| Pasta | O que tem |
| --- | --- |
| `src/app` | Páginas e rotas de API |
| `src/componentes` | Interface, separada por área |
| `src/lib` | Catálogo, frete, pagamento e pedidos |
| `src/dados` | Catálogo inicial e regra de acréscimo |
| `supabase/migrations` | Banco de dados |
| `scripts` | Importação para o Notion |

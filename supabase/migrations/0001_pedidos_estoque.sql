create type status_pedido as enum ('aguardando_pagamento', 'pago', 'cancelado');

create table pedidos (
  id uuid primary key default gen_random_uuid(),
  criado_em timestamptz not null default now(),
  status status_pedido not null default 'aguardando_pagamento',
  nome text not null,
  email text not null,
  telefone text not null,
  frete_id text not null,
  frete_nome text not null,
  frete_centavos integer not null check (frete_centavos >= 0),
  endereco jsonb,
  subtotal_centavos integer not null check (subtotal_centavos >= 0),
  total_centavos integer not null check (total_centavos >= 0),
  preferencia_id text,
  pagamento_id text
);

create table itens_pedido (
  id bigint generated always as identity primary key,
  pedido_id uuid not null references pedidos (id) on delete cascade,
  slug text not null,
  nome text not null,
  preco_centavos integer not null check (preco_centavos >= 0),
  quantidade integer not null check (quantidade > 0)
);

create index itens_pedido_pedido_idx on itens_pedido (pedido_id);

-- Produto sem linha nesta tabela é vendido sem controle de estoque.
create table estoque (
  slug text primary key,
  quantidade integer not null check (quantidade >= 0),
  atualizado_em timestamptz not null default now()
);

-- RLS sem políticas: só o servidor, com a service role, acessa estas tabelas.
alter table pedidos enable row level security;
alter table itens_pedido enable row level security;
alter table estoque enable row level security;

-- Marca o pedido como pago e baixa o estoque uma única vez, mesmo com webhooks repetidos.
create function confirmar_pagamento(p_pedido uuid, p_pagamento text)
returns boolean
language plpgsql
set search_path = public
as $$
begin
  update pedidos
     set status = 'pago', pagamento_id = p_pagamento
   where id = p_pedido and status = 'aguardando_pagamento';

  if not found then
    return false;
  end if;

  update estoque e
     set quantidade = greatest(e.quantidade - i.quantidade, 0),
         atualizado_em = now()
    from itens_pedido i
   where i.pedido_id = p_pedido and i.slug = e.slug;

  return true;
end;
$$;

revoke execute on function confirmar_pagamento(uuid, text) from public, anon, authenticated;

import "server-only";
import { criarSupabase } from "@/lib/supabase";

/** Mapa slug → quantidade. Produto sem linha na tabela `estoque` não tem controle de estoque. */
export async function obterEstoque(slugs: string[]) {
  const supabase = criarSupabase();
  const estoque = new Map<string, number>();
  if (!supabase) return estoque;

  const { data, error } = await supabase.from("estoque").select("slug, quantidade").in("slug", slugs);
  if (error) throw new Error(`Falha ao consultar o estoque: ${error.message}`);
  for (const linha of data) estoque.set(linha.slug, linha.quantidade);
  return estoque;
}

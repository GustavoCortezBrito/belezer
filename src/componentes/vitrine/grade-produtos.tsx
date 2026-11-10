import type { Produto } from "@/lib/catalogo/tipos";
import { CartaoProduto } from "./cartao-produto";

export function GradeProdutos({ produtos }: { produtos: Produto[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {produtos.map((produto) => (
        <CartaoProduto key={produto.slug} produto={produto} />
      ))}
    </div>
  );
}

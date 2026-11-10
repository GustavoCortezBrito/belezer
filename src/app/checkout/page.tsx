import type { Metadata } from "next";
import { FormularioCheckout } from "@/componentes/checkout/formulario-checkout";

export const metadata: Metadata = { title: "Finalizar compra", robots: { index: false } };

export default function Checkout() {
  return (
    <div className="conteudo py-8 md:py-12">
      <h1 className="display-lg mb-8">Finalizar compra</h1>
      <FormularioCheckout />
    </div>
  );
}

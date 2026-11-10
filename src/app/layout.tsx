import type { Metadata } from "next";
import { Figtree, Gloock } from "next/font/google";
import { Cabecalho } from "@/componentes/layout/cabecalho";
import { Rodape } from "@/componentes/layout/rodape";
import { Provedores } from "@/componentes/provedores";
import { GavetaSacola } from "@/componentes/sacola/gaveta-sacola";
import { siteUrl } from "@/lib/env";
import "./globals.css";

const gloock = Gloock({ variable: "--fonte-gloock", subsets: ["latin"], weight: "400" });
const figtree = Figtree({ variable: "--fonte-figtree", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Belezer | Beleza em todas as formas", template: "%s | Belezer" },
  description: "Produtos Truss e cuidados para o cabelo, da loja Belezer em Barretos para a sua casa.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${gloock.variable} ${figtree.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <Provedores>
          <Cabecalho />
          <main className="flex-1">{children}</main>
          <Rodape />
          <GavetaSacola />
        </Provedores>
      </body>
    </html>
  );
}

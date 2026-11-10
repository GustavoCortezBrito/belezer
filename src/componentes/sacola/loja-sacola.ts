"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Categoria } from "@/lib/catalogo/tipos";

export type ItemSacola = {
  slug: string;
  nome: string;
  medida: string;
  categoria: Categoria;
  precoCentavos: number;
  imagem?: string;
  quantidade: number;
};

type EstadoSacola = {
  itens: ItemSacola[];
  aberta: boolean;
  adicionar: (item: Omit<ItemSacola, "quantidade">) => void;
  alterarQuantidade: (slug: string, quantidade: number) => void;
  remover: (slug: string) => void;
  limpar: () => void;
  abrir: () => void;
  fechar: () => void;
};

const MAXIMO_POR_ITEM = 20;

export const useSacola = create<EstadoSacola>()(
  persist(
    (set) => ({
      itens: [],
      aberta: false,
      adicionar: (item) =>
        set((estado) => {
          const existente = estado.itens.find((i) => i.slug === item.slug);
          return {
            aberta: true,
            itens: existente
              ? estado.itens.map((i) =>
                  i.slug === item.slug ? { ...i, quantidade: Math.min(i.quantidade + 1, MAXIMO_POR_ITEM) } : i,
                )
              : [...estado.itens, { ...item, quantidade: 1 }],
          };
        }),
      alterarQuantidade: (slug, quantidade) =>
        set((estado) => ({
          itens:
            quantidade < 1
              ? estado.itens.filter((i) => i.slug !== slug)
              : estado.itens.map((i) =>
                  i.slug === slug ? { ...i, quantidade: Math.min(quantidade, MAXIMO_POR_ITEM) } : i,
                ),
        })),
      remover: (slug) => set((estado) => ({ itens: estado.itens.filter((i) => i.slug !== slug) })),
      limpar: () => set({ itens: [] }),
      abrir: () => set({ aberta: true }),
      fechar: () => set({ aberta: false }),
    }),
    {
      name: "belezer-sacola",
      storage: createJSONStorage(() => localStorage),
      partialize: (estado) => ({ itens: estado.itens }),
      skipHydration: true,
    },
  ),
);

export const subtotalCentavos = (itens: ItemSacola[]) =>
  itens.reduce((soma, item) => soma + item.precoCentavos * item.quantidade, 0);

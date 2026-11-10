const VARIANTES = {
  primario: "bg-coral text-on-coral",
  escuro: "bg-carvao text-on-escuro hover:bg-jardim",
  contorno: "border-carvao text-carvao hover:bg-carvao hover:text-on-escuro",
  claro: "bg-on-escuro text-carvao",
};

/** Classes do botão em cápsula, para usar em <button> e <Link>. */
export const classesBotao = (variante: keyof typeof VARIANTES = "primario", extras = "") =>
  `inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full border-[1.5px] border-transparent px-6 text-center font-semibold leading-none transition duration-180 ease-belezer hover:scale-[1.02] motion-reduce:hover:scale-100 disabled:cursor-not-allowed disabled:border-linha disabled:bg-creme disabled:text-carvao-suave disabled:hover:scale-100 ${VARIANTES[variante]} ${extras}`;

import Image from "next/image";
import type { Categoria } from "@/lib/catalogo/tipos";

type Props = {
  nome: string;
  categoria: Categoria;
  medida: string;
  imagem?: string;
  className?: string;
  tamanhos: string;
  prioridade?: boolean;
};

/** Mostra a foto do produto. Sem foto, usa uma silhueta genérica pelo tipo de embalagem. */
export function ImagemProduto({ nome, categoria, medida, imagem, className = "", tamanhos, prioridade }: Props) {
  if (imagem) {
    return (
      <span className={`relative block aspect-square ${className}`}>
        <Image
          src={imagem}
          alt={nome}
          fill
          sizes={tamanhos}
          priority={prioridade}
          unoptimized={imagem.startsWith("http")}
          className="object-contain"
        />
      </span>
    );
  }
  return (
    <svg
      viewBox="0 0 120 200"
      role="img"
      aria-label={`Ilustração de embalagem: ${nome}`}
      className={`relative w-auto fill-carvao ${className}`}
    >
      <Silhueta categoria={categoria} medida={medida} />
    </svg>
  );
}

function Silhueta({ categoria, medida }: { categoria: Categoria; medida: string }) {
  const rotulo = "fill-creme";
  if (medida === "1 L") {
    return (
      <>
        <rect x="46" y="4" width="28" height="22" rx="4" className="fill-jardim" />
        <rect x="24" y="26" width="72" height="170" rx="14" />
        <rect x="36" y="92" width="48" height="60" rx="4" className={rotulo} />
      </>
    );
  }
  if (categoria === "mascara") {
    return (
      <>
        <rect x="14" y="108" width="92" height="24" rx="6" className="fill-jardim" />
        <rect x="18" y="130" width="84" height="66" rx="12" />
        <rect x="36" y="146" width="48" height="32" rx="4" className={rotulo} />
      </>
    );
  }
  if (categoria === "oleo") {
    return (
      <>
        <rect x="52" y="66" width="16" height="34" rx="6" className="fill-jardim" />
        <rect x="44" y="96" width="32" height="16" rx="4" className="fill-jardim" />
        <rect x="36" y="112" width="48" height="84" rx="10" />
        <rect x="46" y="136" width="28" height="36" rx="3" className={rotulo} />
      </>
    );
  }
  if (categoria === "kit") {
    return (
      <>
        <rect x="10" y="86" width="100" height="110" rx="8" />
        <rect x="30" y="118" width="60" height="44" rx="4" className={rotulo} />
      </>
    );
  }
  if (categoria === "finalizador") {
    return (
      <>
        <rect x="40" y="16" width="44" height="14" rx="4" className="fill-jardim" />
        <rect x="52" y="28" width="20" height="24" className="fill-jardim" />
        <rect x="34" y="50" width="56" height="146" rx="12" />
        <rect x="46" y="96" width="32" height="52" rx="4" className={rotulo} />
      </>
    );
  }
  return (
    <>
      <rect x="46" y="20" width="32" height="28" rx="5" className="fill-jardim" />
      <rect x="30" y="46" width="64" height="150" rx="12" />
      <rect x="42" y="96" width="40" height="52" rx="4" className={rotulo} />
    </>
  );
}

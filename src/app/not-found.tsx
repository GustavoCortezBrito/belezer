import Link from "next/link";
import { classesBotao } from "@/componentes/ui/botao";

export default function NaoEncontrado() {
  return (
    <div className="conteudo py-24 text-center">
      <h1 className="display-lg">Não encontramos esta página</h1>
      <p className="mt-4">O produto pode ter saído da vitrine ou o endereço está incompleto.</p>
      <Link href="/produtos" className={`${classesBotao("escuro")} mt-8`}>
        Ver produtos
      </Link>
    </div>
  );
}

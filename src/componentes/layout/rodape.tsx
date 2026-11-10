import Link from "next/link";
import { loja } from "@/config/loja";
import { CATEGORIAS } from "@/lib/catalogo/tipos";

const LINK = "inline-flex min-h-11 items-center hover:text-pessego";

export function Rodape() {
  return (
    <footer className="fundo-escuro bg-carvao text-on-escuro">
      <div className="conteudo grid gap-8 py-16 md:grid-cols-3">
        <div>
          <p className="display-md">{loja.nome}</p>
          <p className="mt-2">{loja.frase}.</p>
          <p className="mt-2 text-sm">{loja.cidade}</p>
        </div>
        <nav aria-label="Produtos">
          <p className="rotulo mb-2">Produtos</p>
          <ul>
            {Object.entries(CATEGORIAS).map(([slug, nome]) => (
              <li key={slug}>
                <Link href={`/produtos?categoria=${slug}`} className={LINK}>
                  {nome}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="rotulo mb-2">Atendimento</p>
          <ul>
            <li>
              <a href={loja.whatsappUrl} className={LINK}>
                WhatsApp
              </a>
            </li>
            <li>
              <a href={loja.instagramUrl} className={LINK}>
                Instagram {loja.instagramUsuario}
              </a>
            </li>
            <li>
              <Link href="/sobre" className={LINK}>
                Conheça a loja
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

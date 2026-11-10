import Image from "next/image";
import Link from "next/link";
import { classesBotao } from "@/componentes/ui/botao";
import type { Banner } from "@/lib/catalogo/tipos";

const ehVideo = (url: string) => /\.(mp4|webm)(\?|$)/i.test(url);

/** Topo da home. A mídia vem do banner no Notion, o lugar reservado às campanhas do Higgsfield. */
export function DestaqueTopo({ banner }: { banner: Banner }) {
  return (
    <section className="brisa overflow-hidden">
      <div className="conteudo grid items-center gap-8 py-12 md:grid-cols-[1.2fr_1fr] md:py-24">
        <div>
          <p className="rotulo mb-4">Truss na Belezer</p>
          <h1 className="display-xl">{banner.titulo}</h1>
          <p className="mt-4 max-w-[46ch] text-lg">{banner.subtitulo}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={banner.ctaLink} className={classesBotao("primario")}>
              {banner.ctaTexto}
            </Link>
            <Link href="/sobre" className={classesBotao("contorno")}>
              Conhecer a loja
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <span aria-hidden className="absolute -left-8 -top-8 size-48 rounded-[0_100%_0_100%] bg-coral" />
          {banner.midia && ehVideo(banner.midia) ? (
            <video
              src={banner.midia}
              autoPlay
              muted
              loop
              playsInline
              className="relative aspect-[345/420] w-full rounded-lg object-cover"
            />
          ) : (
            <Image
              src={banner.midia ?? "/marca/neon.webp"}
              alt="Letreiro em neon com o símbolo da Belezer sobre o jardim vertical da loja"
              width={345}
              height={420}
              priority
              unoptimized={banner.midia?.startsWith("http")}
              className="relative w-full rounded-lg object-cover"
            />
          )}
        </div>
      </div>
    </section>
  );
}

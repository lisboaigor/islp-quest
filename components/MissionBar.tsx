"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { markRead } from "@/lib/store";

/** Barra fixa no artigo: lê a seção primeiro, depois segue para os exercícios no caderno. */
export function MissionBar({ lesson }: { lesson: { id: string; title: string } }) {
  const router = useRouter();
  return (
    <div className="missionbar" role="region" aria-label="Missão em andamento">
      <div className="mb-text">
        <small>Passo 1 de 2 · leitura</small>
        <b>{lesson.title}</b>
      </div>
      <div className="row">
        <Link className="btn ghost sm" href="/">
          Voltar ao mapa
        </Link>
        <button
          className="btn pen sm"
          onClick={() => {
            markRead(lesson.id);
            router.push(`/l/${lesson.id}`);
          }}
        >
          Terminei de ler, ir aos exercícios
        </button>
      </div>
    </div>
  );
}

"use client";
import Link from "next/link";
import type { Chapter } from "@/lib/types";
import { useStore } from "@/lib/store";
import { Rich } from "./Rich";
import { readHref } from "@/lib/article-links";

export function ChapterTrail({ chapter }: { chapter: Chapter }) {
  const { lessons, read, badges } = useStore();
  const allDone = chapter.lessons.every((l) => lessons[l.id]);
  const won = badges.includes("chefao:" + chapter.id);
  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <p className="crumb">
        <Link href="/">← Mapa</Link>
      </p>
      <h1 style={{ marginTop: 8 }}>{chapter.title}</h1>
      <p className="lead">{chapter.blurb}</p>
      <p className="mute sans" style={{ fontSize: "0.9rem" }}>
        No livro: capítulo {chapter.num}, {chapter.pages} ·{" "}
        <Link href={`/ler/${chapter.id}`}>ler o capítulo</Link>
      </p>
      <ol className="trail">
        {chapter.lessons.map((l) => (
          <li key={l.id} className={lessons[l.id] ? "done" : ""}>
            <Link
              href={
                read[l.id] || lessons[l.id]
                  ? `/l/${l.id}`
                  : (readHref(l.book, l.id) ?? `/l/${l.id}`)
              }
            >
              <h3>{l.title}</h3>
              <Rich as="p" html={l.hook} />
              <span className="meta">
                {l.minutes} min · {l.book} ·{" "}
                {lessons[l.id]
                  ? "concluída"
                  : read[l.id]
                    ? "lida, falta o caderno"
                    : "começa pela leitura"}
              </span>
            </Link>
          </li>
        ))}
        {chapter.lessons.length > 1 && (
          <li className="boss">
            {allDone ? (
              <Link href={`/boss/${chapter.id}`}>
                <h3>Chefão do capítulo{won ? " (derrotado)" : ""}</h3>
                <p>Três desafios para o caderno e quatro cartas, misturados e sem dicas.</p>
              </Link>
            ) : (
              <div className="mute sans">
                <h3>Chefão do capítulo</h3>
                <p>Abre quando você concluir as lições acima.</p>
              </div>
            )}
          </li>
        )}
      </ol>
    </div>
  );
}

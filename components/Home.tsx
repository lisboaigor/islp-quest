"use client";
import Link from "next/link";
import { CHAPTERS, LESSONS, allReviewItems } from "@/content";
import { FitMap } from "./FitMap";
import { Rich } from "./Rich";
import { readHref } from "@/lib/article-links";
import { setEnergy, useNow, useStore, type Energy } from "@/lib/store";

const ENERGY: { id: Energy; label: string; note: string }[] = [
  {
    id: "low",
    label: "Pouca energia",
    note: "Só o essencial: um desafio no caderno por lição, sem aprofundamentos.",
  },
  {
    id: "normal",
    label: "Normal",
    note: "Lição completa. Os aprofundamentos ficam fechados até você querer.",
  },
  { id: "deep", label: "Hiperfoco", note: "Tudo aberto, com aprofundamentos e a caça ao erro." },
];

export function Home() {
  const { lessons, read, cards, energy, days } = useStore();
  const now = useNow();
  const done = new Set(Object.keys(lessons));
  const next = LESSONS.find((l) => !done.has(l.id));
  const nextCh = next && CHAPTERS.find((c) => c.lessons.includes(next));
  const items = allReviewItems();
  const due = items.filter((i) => cards[i.id] && cards[i.id].due <= now).length;

  return (
    <div className="page">
      <section className="hero">
        <h1>Aprender com dados é ajustar uma curva aos pontos</h1>
        <p className="lead">
          Cada ponto abaixo é uma lição do livro. Resolva no seu caderno, e a curva vai se ajustando
          ao que você já entendeu.
        </p>
        <FitMap chapters={CHAPTERS} done={done} nextId={next?.id} />
      </section>

      <section className="today">
        <div className="mission">
          {next && nextCh ? (
            <>
              <span className="mute sans">Próxima missão · capítulo {nextCh.num}</span>
              <h2>{next.title}</h2>
              <Rich as="p" html={next.hook} />
              <p className="mute sans" style={{ fontSize: "0.9rem" }}>
                Cerca de {next.minutes} min. Deixe o caderno e uma caneta por perto.
              </p>
              <ol className="steps2">
                <li className={read[next.id] ? "done" : "now"}>
                  <b>Ler</b> {next.book}
                </li>
                <li className={read[next.id] ? "now" : ""}>
                  <b>Exercícios</b> no seu caderno
                </li>
              </ol>
              {read[next.id] ? (
                <div className="row">
                  <Link className="btn pen" href={`/l/${next.id}`}>
                    Ir aos exercícios
                  </Link>
                  <Link className="btn ghost" href={readHref(next.book, next.id) ?? "/ler"}>
                    Reler o trecho
                  </Link>
                </div>
              ) : (
                <Link className="btn pen" href={readHref(next.book, next.id) ?? `/l/${next.id}`}>
                  Começar pela leitura
                </Link>
              )}
            </>
          ) : (
            <>
              <h2>Livro concluído</h2>
              <p>
                Todos os pontos estão explicados. A revisão espaçada mantém o que você aprendeu.
              </p>
            </>
          )}
          <div className="energy" role="group" aria-label="Energia de hoje">
            {ENERGY.map((e) => (
              <button key={e.id} aria-pressed={energy === e.id} onClick={() => setEnergy(e.id)}>
                {e.label}
              </button>
            ))}
          </div>
          <p className="energy-note">{ENERGY.find((e) => e.id === energy)?.note}</p>
        </div>

        <div>
          <h3>Revisão de hoje</h3>
          <p className="mute" style={{ margin: "6px 0 12px" }}>
            {due > 0
              ? `${due} ${due === 1 ? "item espera" : "itens esperam"} por você, misturados entre capítulos.`
              : "Nada pendente. Quando você erra um desafio, ele volta aqui."}
          </p>
          {due > 0 && (
            <Link className="btn ghost sm" href="/review">
              Revisar agora
            </Link>
          )}
          <p className="mute sans" style={{ fontSize: "0.88rem", marginTop: 18 }}>
            {days.length === 0
              ? "Seu primeiro dia ainda não começou."
              : `${days.length} ${days.length === 1 ? "dia estudado" : "dias estudados"}. Pular dias não zera nada.`}
          </p>
        </div>
      </section>

      <section>
        <h2>Capítulos</h2>
        <ul className="chap-list">
          {CHAPTERS.map((c) => {
            const n = c.lessons.filter((l) => done.has(l.id)).length;
            return (
              <li key={c.id}>
                <Link href={`/c/${c.id}`}>
                  <span className="n">{c.num}</span>
                  <span>
                    <span className="t">{c.title}</span>
                    <br />
                    <span className="s">{c.blurb}</span>
                  </span>
                  <span className="s">
                    {n}/{c.lessons.length}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

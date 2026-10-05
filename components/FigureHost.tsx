"use client";
import { useEffect, useState } from "react";
import { FIGURES, figureKeys } from "@/lib/figure-refs";

/** Modal que abre o PDF do livro na página da figura clicada (botões com data-fig). */
export function FigureHost() {
  const [fig, setFig] = useState<string | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-fig]");
      if (el?.dataset.fig && FIGURES[el.dataset.fig]) {
        e.preventDefault();
        setFig(el.dataset.fig);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!fig) return;
    const keys = figureKeys();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFig(null);
      if (e.key === "ArrowRight" && e.altKey)
        setFig(keys[Math.min(keys.length - 1, keys.indexOf(fig) + 1)]);
      if (e.key === "ArrowLeft" && e.altKey) setFig(keys[Math.max(0, keys.indexOf(fig) - 1)]);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [fig]);

  if (!fig) return null;
  const info = FIGURES[fig];
  const keys = figureKeys();
  const i = keys.indexOf(fig);
  const src = `/livro.pdf#page=${info.pdf}&navpanes=0`;
  return (
    <div className="scrim figmodal" onClick={() => setFig(null)}>
      <div
        className="figbox"
        role="dialog"
        aria-modal="true"
        aria-label={`Figura ${fig} do livro`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="figbar">
          <div>
            <b>Figura {fig}</b>
            <span className="mute"> · página {info.page} do livro</span>
          </div>
          <div className="row">
            <button
              className="btn ghost sm"
              onClick={() => setFig(keys[i - 1])}
              disabled={i === 0}
              aria-label="Figura anterior"
            >
              ←
            </button>
            <button
              className="btn ghost sm"
              onClick={() => setFig(keys[i + 1])}
              disabled={i === keys.length - 1}
              aria-label="Próxima figura"
            >
              →
            </button>
            <a className="btn ghost sm" href={src} target="_blank" rel="noreferrer">
              Abrir em nova aba
            </a>
            <button className="btn sm" autoFocus onClick={() => setFig(null)}>
              Fechar
            </button>
          </div>
        </div>
        <iframe key={info.pdf} src={src} title={`Livro, página ${info.page}, Figura ${fig}`} />
        <p className="figfoot mute">
          A figura está na página mostrada. Use o zoom do visualizador de PDF; Esc fecha. Alt +
          setas troca de figura.
        </p>
      </div>
    </div>
  );
}

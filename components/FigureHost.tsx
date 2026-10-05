"use client";
import { useEffect, useState } from "react";
import { FIGURES, figureKeys, printedPage } from "@/lib/figure-refs";
import { PdfReader } from "./PdfReader";

const PDF = "/livro.pdf";

/**
 * Modal com o leitor completo do livro. O leitor fica montado depois da primeira abertura:
 * trocar de figura só manda ele saltar para a página, sem recarregar o PDF.
 */
export function FigureHost() {
  const [fig, setFig] = useState<string | null>(null); // última figura mostrada
  const [page, setPage] = useState(1); // página (do arquivo) em exibição
  const [open, setOpen] = useState(false);
  const [full, setFull] = useState(false);

  const goFig = (k: string) => {
    setFig(k);
    setPage(FIGURES[k].pdf);
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-fig]");
      if (el?.dataset.fig && FIGURES[el.dataset.fig]) {
        e.preventDefault();
        setFig(el.dataset.fig);
        setPage(FIGURES[el.dataset.fig].pdf);
        setOpen(true);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!open || !fig) return;
    const keys = figureKeys();
    const at = keys.indexOf(fig);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.altKey && e.key === "ArrowRight") goFig(keys[Math.min(keys.length - 1, at + 1)]);
      if (e.altKey && e.key === "ArrowLeft") goFig(keys[Math.max(0, at - 1)]);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, fig]);

  if (!fig) return null;
  const keys = figureKeys();
  const i = keys.indexOf(fig);
  const figPage = FIGURES[fig].pdf;
  return (
    <div className="scrim figmodal" hidden={!open} onClick={() => setOpen(false)}>
      <div
        className={`figbox${full ? " full" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={`Figura ${fig} do livro`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="figbar">
          <div>
            <b>Figura {fig}</b>
            <span className="mute"> · página {printedPage(figPage) ?? figPage} do livro</span>
            {page !== figPage && (
              <button
                className="btn ghost sm"
                style={{ marginLeft: 8 }}
                onClick={() => setPage(figPage)}
              >
                Voltar à figura
              </button>
            )}
          </div>
          <div className="row">
            <button
              className="btn ghost sm"
              onClick={() => goFig(keys[i - 1])}
              disabled={i === 0}
              aria-label="Figura anterior"
            >
              ← Figura
            </button>
            <button
              className="btn ghost sm"
              onClick={() => goFig(keys[i + 1])}
              disabled={i === keys.length - 1}
              aria-label="Próxima figura"
            >
              Figura →
            </button>
            <button className="btn ghost sm" aria-pressed={full} onClick={() => setFull(!full)}>
              {full ? "Reduzir" : "Expandir"}
            </button>
            <a
              className="btn ghost sm"
              href={`${PDF}#page=${page}`}
              target="_blank"
              rel="noreferrer"
            >
              Abrir em nova aba
            </a>
            <button className="btn sm" autoFocus onClick={() => setOpen(false)}>
              Fechar
            </button>
          </div>
        </div>
        <PdfReader url={PDF} page={page} visible={open} onPage={setPage} />
        <p className="figfoot mute">
          Alt + setas troca de figura; Esc fecha; Ctrl/⌘ + F busca no livro. Trocar de figura não
          recarrega o PDF.
        </p>
      </div>
    </div>
  );
}

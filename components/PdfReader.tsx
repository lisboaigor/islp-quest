"use client";
import "pdfjs-dist/web/pdf_viewer.css";
import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import type {
  EventBus,
  PDFFindController,
  PDFLinkService,
  PDFViewer,
} from "pdfjs-dist/web/pdf_viewer.mjs";
import { PDF_CHAPTERS, printedPage } from "@/lib/figure-refs";

type Lib = typeof import("pdfjs-dist/web/pdf_viewer.mjs");
type Outline = Awaited<ReturnType<PDFDocumentProxy["getOutline"]>>;
type Api = { viewer: PDFViewer; bus: EventBus; link: PDFLinkService };

/**
 * Documento e biblioteca do visualizador são carregados uma única vez por sessão.
 * Só os trechos necessários do PDF são baixados (o servidor aceita pedidos parciais).
 */
let loading: Promise<{ doc: PDFDocumentProxy; lib: Lib }> | null = null;
function loadPdf(url: string) {
  if (!loading) {
    loading = (async () => {
      const pdfjs = await import("pdfjs-dist");
      // O visualizador (pdf_viewer.mjs) espera encontrar a biblioteca neste global.
      (globalThis as unknown as { pdfjsLib: unknown }).pdfjsLib = pdfjs;
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url,
      ).toString();
      const lib = await import("pdfjs-dist/web/pdf_viewer.mjs");
      const doc = await pdfjs.getDocument({
        url,
        disableAutoFetch: true,
        disableStream: true,
        rangeChunkSize: 262144,
      }).promise;
      return { doc, lib };
    })();
    loading.catch(() => {
      loading = null; // permite tentar de novo
    });
  }
  return loading;
}

/* Comandos do visualizador: ficam fora do componente porque alteram um objeto externo (pdf.js). */
function setScale(v: PDFViewer, value: string) {
  v.currentScaleValue = value;
}
function setPageNumber(v: PDFViewer, n: number) {
  v.currentPageNumber = n;
}
function rotate(v: PDFViewer) {
  v.pagesRotation = (v.pagesRotation + 90) % 360;
}

const ZOOMS: [string, string][] = [
  ["page-width", "Largura da página"],
  ["page-fit", "Página inteira"],
  ["0.75", "75%"],
  ["1", "100%"],
  ["1.25", "125%"],
  ["1.5", "150%"],
  ["2", "200%"],
  ["3", "300%"],
];

export function PdfReader({
  url,
  page,
  visible,
  onPage,
}: {
  url: string;
  page: number; // página (do arquivo) que o leitor deve mostrar
  visible: boolean;
  onPage: (p: number) => void; // avisa a página atual quando o usuário rola
}) {
  const container = useRef<HTMLDivElement>(null);
  const viewerEl = useRef<HTMLDivElement>(null);
  const searchBox = useRef<HTMLInputElement>(null);
  const api = useRef<Api | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const onPageRef = useRef(onPage);
  useEffect(() => {
    onPageRef.current = onPage;
  });

  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [cur, setCur] = useState(1);
  const [draft, setDraft] = useState<string | null>(null);
  const [zoom, setZoom] = useState<{ preset: string | null; pct: number }>({
    preset: "page-width",
    pct: 100,
  });
  const [side, setSide] = useState<null | "chapters" | "thumbs" | "outline">(null);
  const [outline, setOutline] = useState<Outline>([]);
  const [query, setQuery] = useState("");
  const [found, setFound] = useState<{ current: number; total: number; none: boolean } | null>(
    null,
  );

  // Cria o visualizador uma única vez e o mantém vivo enquanto o componente existir.
  useEffect(() => {
    let dead = false;
    const wrap = viewerEl.current;
    (async () => {
      try {
        const { doc: d, lib } = await loadPdf(url);
        if (dead || !container.current || !viewerEl.current) return;
        const bus = new lib.EventBus();
        const link = new lib.PDFLinkService({
          eventBus: bus,
          externalLinkTarget: lib.LinkTarget.BLANK,
        });
        const finder = new lib.PDFFindController({ linkService: link, eventBus: bus });
        const viewer = new lib.PDFViewer({
          container: container.current,
          viewer: viewerEl.current,
          eventBus: bus,
          linkService: link,
          findController: finder as PDFFindController,
        });
        link.setViewer(viewer);
        bus.on("pagesinit", () => {
          setScale(viewer, "page-width");
          setReady(true);
        });
        bus.on("pagechanging", (e: { pageNumber: number }) => {
          setCur(e.pageNumber);
          onPageRef.current(e.pageNumber);
        });
        bus.on("scalechanging", (e: { scale: number; presetValue?: string }) => {
          setZoom({ preset: e.presetValue ?? null, pct: Math.round(e.scale * 100) });
        });
        const onCount = (e: { matchesCount: { current: number; total: number } }) =>
          setFound((f) => ({ ...e.matchesCount, none: f?.none ?? false }));
        bus.on("updatefindmatchescount", onCount);
        bus.on(
          "updatefindcontrolstate",
          (e: { state: number; matchesCount: { current: number; total: number } }) =>
            setFound({ ...e.matchesCount, none: e.state === lib.FindState.NOT_FOUND }),
        );
        api.current = { viewer, bus, link };
        viewer.setDocument(d);
        link.setDocument(d);
        setDoc(d);
        d.getOutline()
          .then((o) => !dead && setOutline(o ?? []))
          .catch(() => {});
      } catch {
        if (!dead) setError(true);
      }
    })();
    return () => {
      dead = true;
      try {
        api.current?.viewer.setDocument(null as never);
      } catch {}
      api.current = null;
      wrap?.replaceChildren(); // evita páginas duplicadas se o efeito rodar duas vezes (modo dev)
      setReady(false);
    };
  }, [url]);

  // Vai direto para a página pedida, sem recarregar o documento.
  useEffect(() => {
    const v = api.current?.viewer;
    if (ready && v && v.currentPageNumber !== page) setPageNumber(v, page);
  }, [page, ready]);

  // Reajusta o layout quando o modal reaparece ou muda de tamanho (escala "largura da página").
  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const v = api.current?.viewer;
      if (!v || !el.clientWidth) return;
      v.update();
      if (v.currentScaleValue === "page-width" || v.currentScaleValue === "page-fit")
        setScale(v, v.currentScaleValue);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Ctrl/⌘ + F busca dentro do livro enquanto o modal está aberto.
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        searchBox.current?.focus();
        searchBox.current?.select();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible]);

  const search = (text: string, again = false, back = false) => {
    const bus = api.current?.bus;
    if (!bus) return;
    if (!text.trim()) {
      bus.dispatch("findbarclose", { source: null });
      setFound(null);
      return;
    }
    bus.dispatch("find", {
      source: null,
      type: again ? "again" : "",
      query: text,
      caseSensitive: false,
      entireWord: false,
      highlightAll: true,
      findPrevious: back,
      matchDiacritics: false,
    });
  };
  const onQuery = (text: string) => {
    setQuery(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => search(text), 300);
  };
  const goTo = (n: number) => {
    const v = api.current?.viewer;
    if (v) setPageNumber(v, Math.min(Math.max(1, n), v.pagesCount || n));
  };
  const commitPage = () => {
    const n = parseInt(draft ?? "", 10);
    if (Number.isFinite(n)) goTo(n);
    setDraft(null);
  };

  const book = printedPage(cur);
  const total = doc?.numPages ?? 0;
  const chapter = [...PDF_CHAPTERS].reverse().find((c) => c.pdf <= cur);

  return (
    <div className="pdfreader">
      <div className="pdftools" role="toolbar" aria-label="Controles do leitor de PDF">
        <button
          className="btn ghost sm"
          aria-pressed={side !== null}
          onClick={() => setSide(side ? null : "chapters")}
          aria-label="Mostrar ou ocultar a barra lateral"
          title="Barra lateral"
        >
          ☰
        </button>
        <button
          className="btn ghost sm"
          onClick={() => goTo(cur - 1)}
          disabled={cur <= 1}
          aria-label="Página anterior"
        >
          ‹
        </button>
        <label className="sr" htmlFor="pdfpage">
          Página
        </label>
        <input
          id="pdfpage"
          className="pdfpage"
          inputMode="numeric"
          value={draft ?? String(cur)}
          onChange={(e) => setDraft(e.target.value)}
          onFocus={(e) => e.target.select()}
          onBlur={commitPage}
          onKeyDown={(e) => e.key === "Enter" && (e.currentTarget.blur(), undefined)}
        />
        <span className="mute pdfof">/ {total || "…"}</span>
        <button
          className="btn ghost sm"
          onClick={() => goTo(cur + 1)}
          disabled={!total || cur >= total}
          aria-label="Próxima página"
        >
          ›
        </button>
        {book && <span className="mute pdfbook">livro, p. {book}</span>}
        <span className="pdfsep" />
        <button
          className="btn ghost sm"
          onClick={() => api.current?.viewer.decreaseScale()}
          aria-label="Diminuir zoom"
        >
          −
        </button>
        <select
          aria-label="Zoom"
          value={zoom.preset ?? "custom"}
          onChange={(e) => {
            const v = api.current?.viewer;
            if (v) setScale(v, e.target.value);
          }}
        >
          {!zoom.preset && <option value="custom">{zoom.pct}%</option>}
          {ZOOMS.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
        <button
          className="btn ghost sm"
          onClick={() => api.current?.viewer.increaseScale()}
          aria-label="Aumentar zoom"
        >
          +
        </button>
        <button
          className="btn ghost sm"
          onClick={() => {
            const v = api.current?.viewer;
            if (v) rotate(v);
          }}
          aria-label="Girar páginas"
          title="Girar"
        >
          ⟳
        </button>
        <span className="pdfsep" />
        <input
          ref={searchBox}
          className="pdfsearch"
          type="search"
          placeholder="Buscar no livro (Ctrl/⌘ + F)"
          aria-label="Buscar no livro"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              clearTimeout(timer.current);
              search(query, found !== null, e.shiftKey);
            }
          }}
        />
        <button
          className="btn ghost sm"
          onClick={() => search(query, true, true)}
          disabled={!query}
          aria-label="Resultado anterior"
        >
          ↑
        </button>
        <button
          className="btn ghost sm"
          onClick={() => search(query, true, false)}
          disabled={!query}
          aria-label="Próximo resultado"
        >
          ↓
        </button>
        {query && found && (
          <span className="mute pdffound" aria-live="polite">
            {found.none || !found.total ? "Sem resultados" : `${found.current} de ${found.total}`}
          </span>
        )}
      </div>

      <div className="pdfbody">
        {side && (
          <aside className="pdfside" aria-label="Barra lateral do livro">
            <div className="seg" role="tablist">
              <button
                role="tab"
                aria-selected={side === "chapters"}
                onClick={() => setSide("chapters")}
              >
                Capítulos
              </button>
              <button
                role="tab"
                aria-selected={side === "thumbs"}
                onClick={() => setSide("thumbs")}
              >
                Miniaturas
              </button>
              {outline.length > 0 && (
                <button
                  role="tab"
                  aria-selected={side === "outline"}
                  onClick={() => setSide("outline")}
                >
                  Índice
                </button>
              )}
            </div>
            {side === "chapters" && (
              <ol className="pdfchapters">
                {PDF_CHAPTERS.map((c) => (
                  <li key={c.pdf}>
                    <button
                      aria-current={chapter?.pdf === c.pdf ? "true" : undefined}
                      onClick={() => goTo(c.pdf)}
                    >
                      {c.title}
                    </button>
                  </li>
                ))}
              </ol>
            )}
            {side === "thumbs" && doc && <Thumbs doc={doc} current={cur} onGo={goTo} />}
            {side === "outline" && (
              <OutlineList
                items={outline}
                onGo={(dest) => api.current?.link.goToDestination(dest as never)}
              />
            )}
          </aside>
        )}
        <div className="pdfwrap">
          <div className="pdfcontainer" ref={container} tabIndex={0} aria-label="Páginas do livro">
            <div className="pdfViewer" ref={viewerEl} />
          </div>
          {error ? (
            <p className="figstatus">
              Não foi possível abrir o PDF. Confirme que o arquivo está em{" "}
              <code>public/livro.pdf</code>.
            </p>
          ) : (
            !ready && <p className="figstatus">Carregando o livro…</p>
          )}
        </div>
      </div>
    </div>
  );
}

function OutlineList({ items, onGo }: { items: Outline; onGo: (dest: unknown) => void }) {
  return (
    <ul className="pdfoutline">
      {items.map((it, i) => (
        <li key={i}>
          <button onClick={() => it.dest && onGo(it.dest)}>{it.title}</button>
          {it.items?.length > 0 && <OutlineList items={it.items as Outline} onGo={onGo} />}
        </li>
      ))}
    </ul>
  );
}

/** Miniaturas desenhadas sob demanda (só as visíveis na barra lateral). */
function Thumbs({
  doc,
  current,
  onGo,
}: {
  doc: PDFDocumentProxy;
  current: number;
  onGo: (n: number) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const drawn = useRef(new Set<number>());

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const box = e.target as HTMLElement;
          const n = Number(box.dataset.page);
          if (!e.isIntersecting || drawn.current.has(n)) continue;
          drawn.current.add(n);
          const canvas = box.querySelector("canvas");
          if (!canvas) continue;
          doc
            .getPage(n)
            .then((pg) => {
              const base = pg.getViewport({ scale: 1 });
              const dpr = window.devicePixelRatio || 1;
              const vp = pg.getViewport({ scale: (120 / base.width) * dpr });
              canvas.width = Math.floor(vp.width);
              canvas.height = Math.floor(vp.height);
              canvas.style.width = "120px";
              canvas.style.height = `${Math.floor(vp.height / dpr)}px`;
              return pg.render({ canvas, viewport: vp }).promise;
            })
            .catch(() => drawn.current.delete(n));
        }
      },
      { root: el.closest(".pdfside") ?? el, rootMargin: "300px" }, // quem rola é a barra lateral
    );
    el.querySelectorAll("[data-page]").forEach((b) => io.observe(b));
    return () => io.disconnect();
  }, [doc]);

  useEffect(() => {
    root.current?.querySelector(`[data-page="${current}"]`)?.scrollIntoView({ block: "nearest" });
  }, [current]);

  return (
    <div className="pdfthumbs" ref={root}>
      {Array.from({ length: doc.numPages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          data-page={n}
          className="pdfthumb"
          aria-current={n === current ? "page" : undefined}
          aria-label={`Ir para a página ${printedPage(n) ?? n}`}
          onClick={() => onGo(n)}
        >
          <canvas />
          <span>{printedPage(n) ?? n}</span>
        </button>
      ))}
    </div>
  );
}

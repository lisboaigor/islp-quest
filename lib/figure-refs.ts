import figures from "./figures.json";

export interface FigureInfo {
  pdf: number;
  page: number;
}
export const FIGURES = figures as Record<string, FigureInfo>;

/** “Figura 2.6”, “Figuras 2.9, 2.10 e 2.11”, “Fig. 3.1”, “Figs. 3.17 a 3.20”. */
const RE = /\b(Figuras?|Figs?\.)\s+(\d{1,2}\.\d{1,2})((?:\s*(?:,|e|a)\s*\d{1,2}\.\d{1,2})*)/g;

export type Part = { text: string } | { text: string; fig: string };

/** Divide um texto em pedaços; os pedaços com `fig` viram botões que abrem o modal. */
export function splitFigures(src: string): Part[] {
  const out: Part[] = [];
  let last = 0;
  for (const m of src.matchAll(RE)) {
    const start = m.index!;
    if (start > last) out.push({ text: src.slice(last, start) });
    const word = m[1];
    const nums = [m[2], ...(m[3].match(/\d{1,2}\.\d{1,2}/g) ?? [])];
    const seps = m[3].split(/\d{1,2}\.\d{1,2}/).slice(0, -1);
    out.push(
      FIGURES[nums[0]]
        ? { text: `${word} ${nums[0]}`, fig: nums[0] }
        : { text: `${word} ${nums[0]}` },
    );
    nums.slice(1).forEach((n, i) => {
      out.push({ text: seps[i] });
      out.push(FIGURES[n] ? { text: n, fig: n } : { text: n });
    });
    last = start + m[0].length;
  }
  if (last < src.length) out.push({ text: src.slice(last) });
  return out;
}

/** Para strings com HTML simples (componente Rich). */
export function linkifyFigures(html: string): string {
  return splitFigures(html)
    .map((p) =>
      "fig" in p
        ? `<button type="button" class="figref" data-fig="${p.fig}">${p.text}</button>`
        : p.text,
    )
    .join("");
}

export function figureKeys(): string[] {
  return Object.keys(FIGURES).sort((a, b) => {
    const [a1, a2] = a.split(".").map(Number),
      [b1, b2] = b.split(".").map(Number);
    return a1 - b1 || a2 - b2;
  });
}

export const LAST_PDF_PAGE = 613;

/** Página impressa do livro a partir da página do arquivo PDF (o deslocamento muda ao longo do livro). */
export function printedPage(pdf: number): number | null {
  if (pdf < 12) return null;
  if (pdf <= 24) return pdf - 11;
  if (pdf <= 77) return pdf - 10;
  if (pdf === 78) return 69;
  if (pdf <= 208) return pdf - 9;
  if (pdf === 209) return 201;
  if (pdf <= 337) return pdf - 8;
  if (pdf === 338) return 331;
  if (pdf <= 474) return pdf - 7;
  if (pdf === 475) return 469;
  return pdf - 6;
}

/** Aberturas de capítulo, em páginas do arquivo PDF (conferidas no próprio livro). */
export const PDF_CHAPTERS: { title: string; pdf: number }[] = [
  { title: "1. Introdução", pdf: 12 },
  { title: "2. Aprendizado estatístico", pdf: 25 },
  { title: "3. Regressão linear", pdf: 78 },
  { title: "4. Classificação", pdf: 144 },
  { title: "5. Reamostragem", pdf: 209 },
  { title: "6. Seleção e regularização", pdf: 237 },
  { title: "7. Além da linearidade", pdf: 297 },
  { title: "8. Métodos baseados em árvores", pdf: 338 },
  { title: "9. Máquinas de vetores de suporte", pdf: 374 },
  { title: "10. Deep learning", pdf: 406 },
  { title: "11. Análise de sobrevivência", pdf: 475 },
  { title: "12. Aprendizado não supervisionado", pdf: 509 },
  { title: "13. Testes múltiplos", pdf: 563 },
  { title: "Índice remissivo", pdf: 603 },
];

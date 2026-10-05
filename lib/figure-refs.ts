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

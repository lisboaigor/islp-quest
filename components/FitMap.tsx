import Link from "next/link";
import type { Chapter } from "@/lib/types";

const W = 1000,
  H = 340,
  PAD = { l: 44, r: 20, t: 24, b: 40 };
/** Arredonda para evitar divergência de serialização entre servidor e navegador (hidratação). */
const q = (v: number) => Math.round(v * 10) / 10;

/** Ruído determinístico: cada lição sempre cai no mesmo lugar do gráfico. */
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return ((h >>> 0) % 1000) / 1000;
}

export function FitMap({
  chapters,
  done,
  nextId,
}: {
  chapters: Chapter[];
  done: Set<string>;
  nextId?: string;
}) {
  const all = chapters.flatMap((c) => c.lessons.map((l) => ({ l, ch: c })));
  const n = all.length;
  const x = (i: number) => q(PAD.l + (i / Math.max(n - 1, 1)) * (W - PAD.l - PAD.r));
  const y = (v: number) => q(PAD.t + (1 - v) * (H - PAD.t - PAD.b));
  const f = (i: number) => 0.5 + 0.26 * Math.sin(i / 4.2) + 0.1 * Math.cos(i / 1.7);
  const pts = all.map(({ l }, i) => ({
    id: l.id,
    title: l.title,
    i,
    px: x(i),
    py: y(Math.min(0.96, Math.max(0.06, f(i) + (hash(l.id) - 0.5) * 0.36))),
  }));
  const dpts = pts.filter((p) => done.has(p.id));

  // Suavização por kernel gaussiano sobre os pontos concluídos.
  const coords: [number, number][] = [];
  const fit = (px: number) => {
    let sw = 0,
      sy = 0;
    for (const p of dpts) {
      const w = Math.exp(-((px - p.px) ** 2) / (2 * 55 ** 2));
      sw += w;
      sy += w * p.py;
    }
    return sy / sw;
  };
  if (dpts.length >= 2) {
    const a = dpts[0].px,
      b = dpts[dpts.length - 1].px;
    for (let px = a; px <= b; px += 6) coords.push([px, q(fit(px))]);
    coords.push([b, q(fit(b))]);
  }
  const curve = coords
    .map(([px, py], k) => `${k ? "L" : "M"}${px.toFixed(1)} ${py.toFixed(1)}`)
    .join(" ");
  const len =
    Math.ceil(
      coords.reduce(
        (acc, c, k) =>
          k ? acc + Math.hypot(c[0] - coords[k - 1][0], c[1] - coords[k - 1][1]) : acc,
        0,
      ),
    ) + 10;

  const bounds = chapters.map((c, k) => ({
    c,
    start: chapters.slice(0, k).reduce((n, p) => n + p.lessons.length, 0),
  }));

  return (
    <div className="plot-wrap">
      <svg
        className="plot"
        viewBox={`0 0 ${W} ${H}`}
        role="group"
        aria-label="Mapa de progresso: cada ponto é uma lição"
      >
        <line className="axis" x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} />
        <line className="axis" x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b} />
        {bounds.map(({ c, start }) => (
          <g key={c.id}>
            <line
              className="chapline"
              x1={x(start) - 6}
              x2={x(start) - 6}
              y1={PAD.t}
              y2={H - PAD.b}
            />
            <text className="chaplabel" x={x(start)} y={H - 14}>
              {c.num}
            </text>
          </g>
        ))}
        {dpts.length >= 2 &&
          dpts.map((p) => (
            <line
              key={"r" + p.id}
              className="resid"
              x1={p.px}
              x2={p.px}
              y1={p.py}
              y2={q(fit(p.px))}
            />
          ))}
        {curve && <path className="curve" d={curve} style={{ ["--len" as string]: len }} />}
        {pts.map((p) => (
          <Link key={p.id} href={`/l/${p.id}`}>
            <title>{p.title}</title>
            <circle
              className={`pt${done.has(p.id) ? " done" : ""}${p.id === nextId ? " next" : ""}`}
              cx={p.px}
              cy={p.py}
              r={p.id === nextId ? 8 : 6}
            />
          </Link>
        ))}
      </svg>
      <div className="plot-cap">
        <span>
          {dpts.length} de {n} pontos explicados · números no eixo são os capítulos
        </span>
        <span>
          {dpts.length < 2
            ? "Conclua duas lições e a curva aparece."
            : "Cada lição concluída aproxima a curva dos pontos."}
        </span>
      </div>
    </div>
  );
}

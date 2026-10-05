"use client";
import { CHAPTERS, LESSONS } from "@/content";
import { level, useStore } from "@/lib/store";

const LABEL = ["Chute", "Acho que sim", "Certeza"];

export function StatsPage() {
  const { xp, lessons, calib, days, badges, cards } = useStore();
  const done = Object.keys(lessons).length;
  const rows = [0, 1, 2].map((c) => {
    const g = calib.filter((x) => x.conf === c);
    return {
      c,
      n: g.length,
      pct: g.length ? Math.round((g.filter((x) => x.ok).length / g.length) * 100) : null,
    };
  });
  const mastered = Object.values(cards).filter((c) => c.box >= 3).length;
  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <h1>Painel</h1>
      <div className="stat-grid">
        <div>
          <b>{level(xp)}</b>
          <span>nível ({xp} XP)</span>
        </div>
        <div>
          <b>
            {done}/{LESSONS.length}
          </b>
          <span>lições</span>
        </div>
        <div>
          <b>{days.length}</b>
          <span>dias estudados</span>
        </div>
        <div>
          <b>{mastered}</b>
          <span>itens consolidados</span>
        </div>
      </div>

      <h2>Sua calibração</h2>
      <p className="mute">
        Antes de ver cada solução você diz o quanto confia. Se “certeza” acerta quase sempre, sua
        autoavaliação é boa. Se “chute” acerta muito, você sabe mais do que pensa.
      </p>
      <table className="table">
        <thead>
          <tr>
            <th>Você disse</th>
            <th>Desafios</th>
            <th>Acertou de fato</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.c}>
              <td>{LABEL[r.c]}</td>
              <td>{r.n}</td>
              <td>{r.pct === null ? "sem dados" : `${r.pct}%`}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Progresso por capítulo</h2>
      <table className="table">
        <tbody>
          {CHAPTERS.map((c) => (
            <tr key={c.id}>
              <td>
                {c.num}. {c.title}
              </td>
              <td>
                {c.lessons.filter((l) => lessons[l.id]).length}/{c.lessons.length}
              </td>
              <td>{badges.includes("chefao:" + c.id) ? "chefão derrotado" : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

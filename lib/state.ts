/** Formato do progresso, compartilhado entre navegador e servidor (sem dependências de ambiente). */
export type Energy = "low" | "normal" | "deep";
export interface CardState {
  box: number;
  due: number;
  seen: number;
}
export interface State {
  xp: number;
  lessons: Record<string, number>;
  read: Record<string, number>;
  cards: Record<string, CardState>;
  calib: { conf: number; ok: boolean }[];
  days: string[];
  notes: { t: number; text: string }[];
  badges: string[];
  energy: Energy;
}

export const emptyState = (): State => ({
  xp: 0,
  lessons: {},
  read: {},
  cards: {},
  calib: [],
  days: [],
  notes: [],
  badges: [],
  energy: "normal",
});

export function isBlank(s: State): boolean {
  return (
    s.xp === 0 &&
    !s.days.length &&
    !s.notes.length &&
    !s.badges.length &&
    !s.calib.length &&
    !Object.keys(s.lessons).length &&
    !Object.keys(s.read).length &&
    !Object.keys(s.cards).length
  );
}

const isRec = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
const num = (v: unknown, min = 0) =>
  typeof v === "number" && Number.isFinite(v) && v >= min ? v : null;
const key = (k: string) => k.length > 0 && k.length <= 120;

/** Valida e normaliza qualquer entrada externa (JSON do navegador ou do localStorage). Lança se inválida. */
export function sanitize(input: unknown): State {
  if (!isRec(input)) throw new Error("estado inválido");
  const out = emptyState();
  const x = num(input.xp);
  if (x === null) throw new Error("xp inválido");
  out.xp = Math.floor(x);
  for (const f of ["lessons", "read"] as const) {
    const src = input[f] ?? {};
    if (!isRec(src)) throw new Error(`${f} inválido`);
    for (const [k, v] of Object.entries(src)) {
      const n = num(v);
      if (key(k) && n !== null) out[f][k] = n;
    }
  }
  const cards = input.cards ?? {};
  if (!isRec(cards)) throw new Error("cards inválido");
  for (const [k, v] of Object.entries(cards)) {
    if (!key(k) || !isRec(v)) continue;
    const box = num(v.box),
      due = num(v.due),
      seen = num(v.seen);
    if (box !== null && due !== null && seen !== null)
      out.cards[k] = { box: Math.min(5, Math.floor(box)), due, seen: Math.floor(seen) };
  }
  if (Array.isArray(input.calib))
    out.calib = input.calib
      .filter(isRec)
      .map((c) => ({
        conf: Math.min(2, Math.max(0, Math.floor(num(c.conf) ?? 1))),
        ok: c.ok === true,
      }))
      .slice(-200);
  if (Array.isArray(input.days))
    out.days = [
      ...new Set(
        input.days.filter(
          (d): d is string => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d),
        ),
      ),
    ].slice(-3650);
  if (Array.isArray(input.notes))
    out.notes = input.notes
      .filter(isRec)
      .flatMap((n) => {
        const t = num(n.t);
        return t !== null && typeof n.text === "string" ? [{ t, text: n.text.slice(0, 5000) }] : [];
      })
      .slice(0, 2000);
  if (Array.isArray(input.badges))
    out.badges = [
      ...new Set(input.badges.filter((b): b is string => typeof b === "string" && key(b))),
    ].slice(0, 500);
  out.energy = input.energy === "low" || input.energy === "deep" ? input.energy : "normal";
  return out;
}

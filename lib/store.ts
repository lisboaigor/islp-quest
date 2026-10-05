"use client";
import { useState, useSyncExternalStore } from "react";
import { emptyState, isBlank, sanitize, type State } from "./state";

export type { Energy, CardState, State } from "./state";

/*
 * Fonte da verdade: banco SQLite no servidor (/api/state).
 * O localStorage é só um cache para abrir rápido e funcionar se o servidor estiver fora do ar.
 */
const KEY = "islp-quest-v2";
const BACKUP = "islp-quest-v2-backup";
const empty: State = emptyState();
let state: State = empty;
let loaded = false;
let synced = false;
let timer: ReturnType<typeof setTimeout> | undefined;
const subs = new Set<() => void>();

function cache() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
}
function emit() {
  subs.forEach((f) => f());
}

function push(keepalive = false) {
  fetch("/api/state", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(state),
    keepalive,
  }).catch(() => {});
}
function schedulePush() {
  if (!synced) return;
  clearTimeout(timer);
  timer = setTimeout(() => push(), 300);
}

async function syncWithServer() {
  try {
    const r = await fetch("/api/state", { cache: "no-store" });
    if (!r.ok) throw new Error(String(r.status));
    const server = sanitize(await r.json());
    if (isBlank(server)) {
      if (!isBlank(state)) push(); // primeira vez: migra o que estava no navegador para o banco
    } else if (JSON.stringify(server) !== JSON.stringify(state)) {
      if (!isBlank(state)) {
        try {
          localStorage.setItem(BACKUP, JSON.stringify(state));
        } catch {}
      }
      state = server;
      cache();
      emit();
    }
    synced = true;
  } catch {
    /* sem servidor: continua com o cache local e tenta de novo na próxima atualização */
    synced = true;
  }
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = sanitize(JSON.parse(raw));
  } catch {}
  void syncWithServer();
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && synced) {
      clearTimeout(timer);
      push(true);
    }
  });
}

export function update(fn: (s: State) => State) {
  load();
  state = fn(state);
  cache();
  emit();
  schedulePush();
}
export function useStore(): State {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      load();
      return () => subs.delete(cb);
    },
    () => {
      load();
      return state;
    },
    () => empty,
  );
}

export const today = () => new Date().toISOString().slice(0, 10);
export const level = (xp: number) => Math.floor(Math.sqrt(xp / 60)) + 1;
export const levelFloor = (lv: number) => (lv - 1) ** 2 * 60;

export function addXp(n: number) {
  update((s) => ({
    ...s,
    xp: s.xp + n,
    days: s.days.includes(today()) ? s.days : [...s.days, today()],
  }));
}
export function completeLesson(id: string) {
  update((s) => ({ ...s, lessons: { ...s.lessons, [id]: s.lessons[id] ?? Date.now() } }));
}
export function markRead(id: string) {
  update((s) => ({ ...s, read: { ...s.read, [id]: s.read[id] ?? Date.now() } }));
}
export function addBadge(b: string) {
  update((s) => (s.badges.includes(b) ? s : { ...s, badges: [...s.badges, b] }));
}
export function recordCalib(conf: number, ok: boolean) {
  update((s) => ({ ...s, calib: [...s.calib.slice(-199), { conf, ok }] }));
}
export function addNote(text: string) {
  update((s) => ({ ...s, notes: [{ t: Date.now(), text }, ...s.notes] }));
}
export function removeNote(t: number) {
  update((s) => ({ ...s, notes: s.notes.filter((n) => n.t !== t) }));
}
export function setEnergy(energy: State["energy"]) {
  update((s) => ({ ...s, energy }));
}

/* Repetição espaçada simples (caixas de Leitner). Errar volta à caixa 0, sem punição de XP. */
const GAPS = [0, 1, 3, 7, 16, 35];
const DAY = 86_400_000;
export function seedCards(ids: string[]) {
  update((s) => {
    const cards = { ...s.cards };
    for (const id of ids) if (!cards[id]) cards[id] = { box: 0, due: Date.now(), seen: 0 };
    return { ...s, cards };
  });
}
export function gradeCard(id: string, result: "miss" | "almost" | "hit") {
  update((s) => {
    const c = s.cards[id] ?? { box: 0, due: 0, seen: 0 };
    const box =
      result === "hit" ? Math.min(c.box + 1, GAPS.length - 1) : result === "almost" ? c.box : 0;
    const gap = result === "miss" ? 0.01 : Math.max(GAPS[box], 0.3);
    return {
      ...s,
      cards: { ...s.cards, [id]: { box, due: Date.now() + gap * DAY, seen: c.seen + 1 } },
    };
  });
}

/** Instante fixado na montagem do componente (evita chamar Date.now() durante a renderização). */
export function useNow(): number {
  return useState(() => Date.now())[0];
}

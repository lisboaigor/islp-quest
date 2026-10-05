import fs from "node:fs";
import path from "node:path";
import { emptyState, type State } from "./state";

/* SQLite embutido no Node (node:sqlite): sem dependência nativa. Arquivo em data/islp.db (ou ISLP_DB). */
interface Stmt {
  all(...a: unknown[]): Record<string, unknown>[];
  run(...a: unknown[]): unknown;
}
interface Db {
  exec(sql: string): void;
  prepare(sql: string): Stmt;
}

const g = globalThis as unknown as { __islpDb?: Db };

function open(): Db {
  if (g.__islpDb) return g.__islpDb;
  const file = process.env.ISLP_DB || path.join(process.cwd(), "data", "islp.db");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const { DatabaseSync } = process.getBuiltinModule("node:sqlite") as unknown as {
    DatabaseSync: new (f: string) => Db;
  };
  const db = new DatabaseSync(file);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;
    CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS lessons (id TEXT PRIMARY KEY, done_at REAL NOT NULL);
    CREATE TABLE IF NOT EXISTS reads (id TEXT PRIMARY KEY, read_at REAL NOT NULL);
    CREATE TABLE IF NOT EXISTS cards (id TEXT PRIMARY KEY, box INTEGER NOT NULL, due REAL NOT NULL, seen INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS calibration (id INTEGER PRIMARY KEY AUTOINCREMENT, conf INTEGER NOT NULL, ok INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS days (day TEXT PRIMARY KEY);
    CREATE TABLE IF NOT EXISTS notes (t REAL PRIMARY KEY, text TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS badges (id TEXT PRIMARY KEY);
  `);
  g.__islpDb = db;
  return db;
}

export function loadState(): State {
  const db = open();
  const s = emptyState();
  const meta = Object.fromEntries(
    db
      .prepare("SELECT key, value FROM meta")
      .all()
      .map((r) => [r.key as string, r.value as string]),
  );
  s.xp = Number(meta.xp ?? 0) || 0;
  s.energy = meta.energy === "low" || meta.energy === "deep" ? meta.energy : "normal";
  for (const r of db.prepare("SELECT id, done_at FROM lessons").all())
    s.lessons[r.id as string] = r.done_at as number;
  for (const r of db.prepare("SELECT id, read_at FROM reads").all())
    s.read[r.id as string] = r.read_at as number;
  for (const r of db.prepare("SELECT id, box, due, seen FROM cards").all())
    s.cards[r.id as string] = {
      box: r.box as number,
      due: r.due as number,
      seen: r.seen as number,
    };
  s.calib = db
    .prepare("SELECT conf, ok FROM calibration ORDER BY id")
    .all()
    .map((r) => ({ conf: r.conf as number, ok: r.ok === 1 }));
  s.days = db
    .prepare("SELECT day FROM days ORDER BY day")
    .all()
    .map((r) => r.day as string);
  s.notes = db
    .prepare("SELECT t, text FROM notes ORDER BY t DESC")
    .all()
    .map((r) => ({ t: r.t as number, text: r.text as string }));
  s.badges = db
    .prepare("SELECT id FROM badges ORDER BY id")
    .all()
    .map((r) => r.id as string);
  return s;
}

/** Substitui todo o progresso numa única transação (o estado é pequeno e o app tem um só usuário). */
export function saveState(s: State): void {
  const db = open();
  db.exec("BEGIN IMMEDIATE");
  try {
    for (const t of ["meta", "lessons", "reads", "cards", "calibration", "days", "notes", "badges"])
      db.exec(`DELETE FROM ${t}`);
    db.exec("DELETE FROM sqlite_sequence WHERE name = 'calibration'");
    const meta = db.prepare("INSERT INTO meta (key, value) VALUES (?, ?)");
    meta.run("xp", String(s.xp));
    meta.run("energy", s.energy);
    const les = db.prepare("INSERT INTO lessons (id, done_at) VALUES (?, ?)");
    for (const [id, t] of Object.entries(s.lessons)) les.run(id, t);
    const rd = db.prepare("INSERT INTO reads (id, read_at) VALUES (?, ?)");
    for (const [id, t] of Object.entries(s.read)) rd.run(id, t);
    const cd = db.prepare("INSERT INTO cards (id, box, due, seen) VALUES (?, ?, ?, ?)");
    for (const [id, c] of Object.entries(s.cards)) cd.run(id, c.box, c.due, c.seen);
    const cal = db.prepare("INSERT INTO calibration (conf, ok) VALUES (?, ?)");
    for (const c of s.calib) cal.run(c.conf, c.ok ? 1 : 0);
    const dy = db.prepare("INSERT INTO days (day) VALUES (?)");
    for (const d of s.days) dy.run(d);
    const nt = db.prepare("INSERT INTO notes (t, text) VALUES (?, ?)");
    for (const n of s.notes) nt.run(n.t, n.text);
    const bd = db.prepare("INSERT INTO badges (id) VALUES (?)");
    for (const b of s.badges) bd.run(b);
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}

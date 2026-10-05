"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { addNote, level, levelFloor, useStore } from "@/lib/store";

const NAV = [
  { href: "/", label: "Mapa" },
  { href: "/review", label: "Revisão" },
  { href: "/ler", label: "Leitura" },
  { href: "/notes", label: "Ideias" },
  { href: "/stats", label: "Painel" },
];

function FocusTimer() {
  const [left, setLeft] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);
  const run = left !== null && left > 0 && !paused;
  useEffect(() => {
    if (!run) return;
    tick.current = setInterval(() => setLeft((v) => (v === null ? v : Math.max(0, v - 1))), 1000);
    return () => {
      if (tick.current) clearInterval(tick.current);
    };
  }, [run]);
  if (left === null)
    return (
      <button
        className="chip"
        onClick={() => {
          setLeft(10 * 60);
          setPaused(false);
        }}
        title="Timer de 10 minutos, opcional"
      >
        foco 10 min
      </button>
    );
  const m = String(Math.floor(left / 60)).padStart(2, "0");
  const s = String(left % 60).padStart(2, "0");
  return (
    <span className="chip timer" data-done={left === 0}>
      {left === 0 ? "Hora de uma pausa" : `${m}:${s}`}
      {left > 0 && (
        <button onClick={() => setPaused(!paused)} aria-label={run ? "Pausar" : "Retomar"}>
          {run ? "❙❙" : "▶"}
        </button>
      )}
      <button
        onClick={() => {
          setLeft(null);
          setPaused(false);
        }}
        aria-label="Fechar timer"
      >
        ×
      </button>
    </span>
  );
}

export function Header() {
  const path = usePathname();
  const { xp } = useStore();
  const lv = level(xp);
  const pct = Math.round(((xp - levelFloor(lv)) / (levelFloor(lv + 1) - levelFloor(lv))) * 100);
  return (
    <header className="top">
      <Link href="/" className="brand">
        ISLP <span>quest</span>
      </Link>
      <nav aria-label="Principal">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} aria-current={path === n.href ? "page" : undefined}>
            {n.label}
          </Link>
        ))}
      </nav>
      <div className="hud">
        <FocusTimer />
        <span className="lvl" title={`${xp} XP`}>
          <b>Nível {lv}</b>
          <i style={{ ["--p" as string]: `${pct}%` }} />
        </span>
      </div>
    </header>
  );
}

export function ParkingLot() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  function save() {
    if (!text.trim()) return;
    addNote(text.trim());
    setText("");
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setOpen(false);
    }, 900);
  }
  return (
    <>
      <button className="parking" onClick={() => setOpen(true)} aria-label="Anotar uma ideia solta">
        <span>ideia solta?</span>
      </button>
      {open && (
        <div
          className="scrim"
          role="dialog"
          aria-modal="true"
          aria-label="Ideia solta"
          onClick={() => setOpen(false)}
        >
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <h2>Anote e volte para a tarefa</h2>
            <p className="mute">
              A ideia fica guardada na aba Ideias. Você decide depois se ela merece uma tarde.
            </p>
            <textarea
              autoFocus
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) save();
              }}
            />
            <div className="row end">
              <button className="btn ghost" onClick={() => setOpen(false)}>
                Fechar
              </button>
              <button className="btn" onClick={save}>
                {saved ? "Guardada" : "Guardar ideia"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

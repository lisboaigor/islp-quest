"use client";
import { useEffect, useState, useSyncExternalStore } from "react";

const SIZES = [1.0, 1.15, 1.3, 1.5];
const KEY = "islp-reading-size";
const subs = new Set<() => void>();

function readSize(): number {
  try {
    const s = Number(localStorage.getItem(KEY));
    return SIZES[s] ? s : 1;
  } catch {
    return 1;
  }
}
function writeSize(n: number) {
  try {
    localStorage.setItem(KEY, String(n));
  } catch {}
  subs.forEach((f) => f());
}

/** Barra de progresso de leitura e ajuste do tamanho do texto (lembrado neste navegador). */
export function ReadingTools() {
  const [pct, setPct] = useState(0);
  const size = useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    readSize,
    () => 1,
  );

  useEffect(() => {
    document.documentElement.style.setProperty("--essay-scale", String(SIZES[size]));
  }, [size]);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      setPct(
        Math.min(
          100,
          Math.round((h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) * 100),
        ),
      );
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <>
      <div
        className="read-progress"
        role="progressbar"
        aria-label="Progresso de leitura"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <i style={{ width: `${pct}%` }} />
      </div>
      <div className="type-tools" role="group" aria-label="Tamanho do texto">
        <button
          onClick={() => writeSize(Math.max(0, size - 1))}
          disabled={size === 0}
          aria-label="Diminuir texto"
        >
          A−
        </button>
        <button
          onClick={() => writeSize(Math.min(SIZES.length - 1, size + 1))}
          disabled={size === SIZES.length - 1}
          aria-label="Aumentar texto"
        >
          A+
        </button>
      </div>
    </>
  );
}

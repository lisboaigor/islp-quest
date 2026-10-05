"use client";
import { removeNote, useStore } from "@/lib/store";

export function NotesPage() {
  const { notes } = useStore();
  return (
    <div className="page" style={{ maxWidth: 700 }}>
      <h1>Ideias soltas</h1>
      <p className="lead">
        Tudo o que passou pela cabeça enquanto você estudava. Nada aqui é tarefa até você decidir.
      </p>
      {notes.length === 0 && (
        <p className="empty">
          Vazio por enquanto. Use a aba “ideia solta?” na lateral durante uma lição.
        </p>
      )}
      {notes.map((n) => (
        <div className="note" key={n.t}>
          <p>
            {n.text}
            <br />
            <span className="mute sans" style={{ fontSize: "0.82rem" }}>
              {new Date(n.t).toLocaleString("pt-BR")}
            </span>
          </p>
          <button className="btn ghost sm" onClick={() => removeNote(n.t)}>
            Apagar
          </button>
        </div>
      ))}
    </div>
  );
}

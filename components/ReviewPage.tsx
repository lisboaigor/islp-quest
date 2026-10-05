"use client";
import Link from "next/link";
import { useState } from "react";
import { allReviewItems, type ReviewItem } from "@/content";
import { addXp, gradeCard, useNow, useStore } from "@/lib/store";
import { ReviewCard } from "./Runner";

export function ReviewPage() {
  const { cards } = useStore();
  const now = useNow();
  const [queue, setQueue] = useState<ReviewItem[] | null>(null);
  const [i, setI] = useState(0);

  function start() {
    const all = allReviewItems().filter((x) => cards[x.id] && cards[x.id].due <= now);
    // Intercala capítulos: o cérebro aprende melhor a escolher o método do que a repetir um só.
    const shuffled = all.sort(() => Math.random() - 0.5).slice(0, 8);
    setQueue(shuffled);
    setI(0);
  }

  if (!queue) {
    const due = allReviewItems().filter((x) => cards[x.id] && cards[x.id].due <= now).length;
    return (
      <div className="page" style={{ maxWidth: 700 }}>
        <h1>Revisão espaçada</h1>
        <p className="lead">
          Sessões de até 8 itens, de capítulos misturados. Cartas se respondem de cabeça. Desafios
          vão ao caderno.
        </p>
        {due ? (
          <div className="foot">
            <button className="btn pen" onClick={start}>
              Começar ({Math.min(due, 8)} itens)
            </button>
          </div>
        ) : (
          <p className="empty">
            Nada pendente. Conclua lições ou erre um desafio para criar itens de revisão.
            <br />
            <Link href="/">Voltar ao mapa</Link>
          </p>
        )}
      </div>
    );
  }
  const item = queue[i];
  return (
    <div className="page" style={{ maxWidth: 700 }}>
      {item ? (
        <>
          <p className="mute sans">
            {i + 1} de {queue.length}
          </p>
          <ReviewCard
            key={item.id}
            item={item}
            onGrade={(r) => {
              gradeCard(item.id, r);
              addXp(r === "hit" ? 8 : 3);
              setI(i + 1);
            }}
          />
        </>
      ) : (
        <section className="reward">
          <p className="mute sans">Revisão concluída</p>
          <div className="xp">
            {queue.length}
            <small>itens</small>
          </div>
          <p>O que você errou volta em breve; o que acertou volta mais espaçado.</p>
          <div className="foot">
            <Link className="btn" href="/">
              Voltar ao mapa
            </Link>
            <button className="btn ghost" onClick={() => setQueue(null)}>
              Outra rodada
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

import type { Card, Chapter, Lesson, Paper } from "@/lib/types";
import ch01 from "./ch01";
import ch02 from "./ch02";
import ch03 from "./ch03";
import ch04 from "./ch04";
import ch05 from "./ch05";
import ch06 from "./ch06";
import ch07 from "./ch07";
import ch08 from "./ch08";
import ch09 from "./ch09";
import ch10 from "./ch10";
import ch11 from "./ch11";
import ch12 from "./ch12";
import ch13 from "./ch13";

export const CHAPTERS: Chapter[] = [
  ch01,
  ch02,
  ch03,
  ch04,
  ch05,
  ch06,
  ch07,
  ch08,
  ch09,
  ch10,
  ch11,
  ch12,
  ch13,
];

export const LESSONS: Lesson[] = CHAPTERS.flatMap((c) => c.lessons);
export const lessonById = (id: string) => LESSONS.find((l) => l.id === id);
export const chapterOf = (lessonId: string) =>
  CHAPTERS.find((c) => c.lessons.some((l) => l.id === lessonId));
export const chapterById = (id: string) => CHAPTERS.find((c) => c.id === id);

/** Itens de revisão: cartas curtas (responder de cabeça) e desafios (resolver no caderno). */
export interface ReviewItem {
  id: string;
  kind: "card" | "notebook";
  q: string;
  a: string;
  chapter: string;
  rubric?: string[];
}
export function allReviewItems(): ReviewItem[] {
  const out: ReviewItem[] = [];
  for (const ch of CHAPTERS)
    for (const l of ch.lessons) {
      l.cards.forEach((c: Card) =>
        out.push({ id: c.id, kind: "card", q: c.q, a: c.a, chapter: ch.id }),
      );
      l.paper.forEach((p: Paper) =>
        out.push({
          id: "p:" + p.id,
          kind: "notebook",
          q: p.prompt,
          a: p.solution,
          chapter: ch.id,
          rubric: p.rubric,
        }),
      );
    }
  return out;
}

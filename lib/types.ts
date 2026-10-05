export type BlockKind = "text" | "key" | "analogy" | "warn" | "deep" | "code";

export interface Block {
  kind: BlockKind;
  title?: string;
  /** Texto com <b>, <i>, <code> e matemática em $...$ ou $$...$$ */
  body: string;
  /** Nota lateral curta (curiosidade, intuição, ponte para o livro) */
  margin?: string;
}

export interface Predict {
  q: string;
  options: string[];
  answer: number;
  why: string;
}

export interface Paper {
  id: string;
  prompt: string;
  /** Dicas em ordem crescente de ajuda */
  hints: string[];
  solution: string;
  /** Marcos que você confere sozinho depois de ver a solução */
  rubric: string[];
}

export interface Spot {
  intro: string;
  steps: string[];
  wrong: number;
  why: string;
}

export interface Card {
  id: string;
  q: string;
  a: string;
}

export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  /** Onde está no livro: "Seção 2.1.1, pp. 17–20" */
  book: string;
  hook: string;
  predict?: Predict;
  blocks: Block[];
  paper: Paper[];
  spot?: Spot;
  cards: Card[];
  /** Detalhe específico que vale ir ao livro conferir */
  deepDive?: string;
}

export interface Chapter {
  id: string;
  num: number;
  title: string;
  pages: string;
  blurb: string;
  lessons: Lesson[];
}

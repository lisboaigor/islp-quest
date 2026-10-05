"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Block, Lesson, Paper } from "@/lib/types";
import {
  addBadge,
  addXp,
  completeLesson,
  gradeCard,
  markRead,
  recordCalib,
  seedCards,
  useStore,
} from "@/lib/store";
import { Rich } from "./Rich";
import type { ReviewItem } from "@/content";
import { articleLink, readHref } from "@/lib/article-links";

/* ——— blocos de explicação ——— */
function BlockView({ b, open }: { b: Block; open: boolean }) {
  const title = b.title ? <h3>{b.title}</h3> : null;
  if (b.kind === "deep")
    return (
      <details className="blk deep fadein" open={open}>
        <summary>{b.title ?? "Toca do coelho"}</summary>
        <Rich html={b.body} />
      </details>
    );
  if (b.kind === "code")
    return (
      <div className="blk code fadein">
        {title}
        <pre>
          <code>{b.body}</code>
        </pre>
      </div>
    );
  return (
    <div className={`blk ${b.kind} fadein`}>
      {title}
      <Rich html={b.body} />
    </div>
  );
}

/* ——— passo do caderno: o trabalho acontece fora da tela ——— */
export function NotebookStep({
  p,
  hints = true,
  onDone,
}: {
  p: Paper;
  hints?: boolean;
  onDone: (score: number, conf: number) => void;
}) {
  const [phase, setPhase] = useState<"task" | "rate" | "check">("task");
  const [nh, setNh] = useState(0);
  const [conf, setConf] = useState<number | null>(null);
  const [ticks, setTicks] = useState<boolean[]>(p.rubric.map(() => false));
  const score = ticks.filter(Boolean).length / Math.max(p.rubric.length, 1);

  return (
    <div className="fadein">
      <div className="notebook">
        <span className="go">Abra o caderno</span>
        <Rich html={p.prompt} className="q" />
        {phase === "task" && (
          <>
            <p className="mute sans" style={{ fontSize: "0.95rem", marginTop: 14 }}>
              Resolva à mão, sem olhar a solução. Errar aqui faz parte: é o que fixa.
            </p>
            {hints && (
              <div className="hints">
                {p.hints.slice(0, nh).map((h, i) => (
                  <div className="hint" key={i}>
                    <b>Dica {i + 1}.</b> <Rich as="span" html={h} />
                  </div>
                ))}
                {nh < p.hints.length && (
                  <button className="btn ghost sm" onClick={() => setNh(nh + 1)}>
                    {nh === 0 ? "Travei, quero uma dica" : "Preciso de mais uma dica"}
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {phase === "task" && (
        <div className="row end">
          <button className="btn pen" onClick={() => setPhase("rate")}>
            Resolvi no caderno
          </button>
        </div>
      )}

      {phase === "rate" && (
        <>
          <p className="ask">Antes de ver a solução: quanto você confia no que escreveu?</p>
          <div className="conf">
            {["Foi um chute", "Acho que acertei", "Tenho certeza"].map((t, i) => (
              <button key={t} aria-pressed={conf === i} onClick={() => setConf(i)}>
                {t}
              </button>
            ))}
          </div>
          <div className="foot">
            <button className="btn" disabled={conf === null} onClick={() => setPhase("check")}>
              Ver a solução
            </button>
          </div>
        </>
      )}

      {phase === "check" && (
        <>
          <div className="solution">
            <h3>Solução</h3>
            <Rich html={p.solution} />
          </div>
          <p className="ask">Compare com o seu caderno. Marque o que você tinha acertado:</p>
          <ul className="rubric">
            {p.rubric.map((r, i) => (
              <li key={i}>
                <label>
                  <input
                    type="checkbox"
                    checked={ticks[i]}
                    onChange={() => setTicks(ticks.map((t, k) => (k === i ? !t : t)))}
                  />
                  <Rich as="span" html={r} />
                </label>
              </li>
            ))}
          </ul>
          <p className="mute sans" style={{ fontSize: "0.9rem" }}>
            Corrija o seu caderno com outra cor. O que ficou faltando volta na revisão.
          </p>
          <div className="foot">
            <button className="btn" onClick={() => onDone(score, conf ?? 1)}>
              Continuar
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ——— previsão e caça ao erro (escolha na tela, sem caderno) ——— */
function Choice({
  intro,
  options,
  answer,
  why,
  onDone,
  xp,
}: {
  intro?: string;
  options: string[];
  answer: number;
  why: string;
  onDone: (ok: boolean) => void;
  xp?: boolean;
}) {
  const [pick, setPick] = useState<number | null>(null);
  return (
    <div className="fadein">
      {intro && <Rich html={intro} />}
      <div className="opts">
        {options.map((o, i) => (
          <button
            key={i}
            className={`opt${pick !== null ? (i === answer ? " right" : i === pick ? " wrong" : "") : ""}`}
            disabled={pick !== null}
            onClick={() => setPick(i)}
          >
            <Rich as="span" html={o} />
          </button>
        ))}
      </div>
      {pick !== null && (
        <>
          <div className={`feedback${pick === answer ? "" : " no"}`}>
            <b>{pick === answer ? "Isso." : xp ? "Ainda não, e tudo bem." : "Não foi essa."}</b>{" "}
            <Rich as="span" html={why} />
          </div>
          <div className="foot">
            <button className="btn" onClick={() => onDone(pick === answer)}>
              Continuar
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ——— cartas de revisão ——— */
export function ReviewCard({
  item,
  onGrade,
}: {
  item: ReviewItem;
  onGrade: (r: "miss" | "almost" | "hit") => void;
}) {
  const [flip, setFlip] = useState(false);
  const nb = item.kind === "notebook";
  return (
    <div className="fadein">
      <div className="flash">
        <div className="side">
          {nb ? "Desafio para o caderno" : "Responda de cabeça (ou dita em voz alta)"}
        </div>
        <Rich html={item.q} />
        {flip && (
          <div className="back">
            <div className="side">Resposta</div>
            <Rich html={item.a} />
          </div>
        )}
      </div>
      {!flip ? (
        <div className="foot">
          <button className="btn pen" onClick={() => setFlip(true)}>
            {nb ? "Resolvi no caderno, mostrar" : "Já respondi, mostrar"}
          </button>
        </div>
      ) : (
        <div className="grade">
          <button className="btn ghost" onClick={() => onGrade("miss")}>
            Errei
          </button>
          <button className="btn ghost" onClick={() => onGrade("almost")}>
            Quase
          </button>
          <button className="btn fit" onClick={() => onGrade("hit")}>
            Acertei
          </button>
        </div>
      )}
    </div>
  );
}

function Stepper({ n, cur }: { n: number; cur: number }) {
  return (
    <div className="stepper" aria-label={`Passo ${cur + 1} de ${n}`}>
      {Array.from({ length: n }, (_, i) => (
        <i key={i} className={i < cur ? "on" : i === cur ? "cur" : ""} />
      ))}
    </div>
  );
}

type Step =
  | { t: "predict" }
  | { t: "slide"; i: number }
  | { t: "notebook"; i: number }
  | { t: "spot" }
  | { t: "end" };

export function LessonRunner({
  lesson,
  next,
}: {
  lesson: Lesson;
  next?: { href: string; label: string };
}) {
  const { energy, lessons, read } = useStore();
  const already = !!lessons[lesson.id];
  const gate = !read[lesson.id] && !already && !!readHref(lesson.book, lesson.id);
  const blocks = useMemo(
    () => lesson.blocks.filter((b) => !(energy === "low" && b.kind === "deep")),
    [lesson, energy],
  );
  const steps = useMemo<Step[]>(() => {
    const s: Step[] = [];
    if (lesson.predict) s.push({ t: "predict" });
    blocks.forEach((_, i) => s.push({ t: "slide", i }));
    const papers = energy === "low" ? lesson.paper.slice(0, 1) : lesson.paper;
    papers.forEach((_, i) => s.push({ t: "notebook", i }));
    if (lesson.spot && energy !== "low") s.push({ t: "spot" });
    s.push({ t: "end" });
    return s;
  }, [lesson, blocks, energy]);

  const [cur, setCur] = useState(0);
  const [gained, setGained] = useState(0);
  const [misses, setMisses] = useState(0);
  const step = steps[cur];
  const advance = (xp = 0) => {
    if (xp) {
      addXp(xp);
      setGained((g) => g + xp);
    }
    setCur((c) => Math.min(c + 1, steps.length - 1));
    window.scrollTo({ top: 0 });
  };

  const margin = step.t === "slide" ? blocks[step.i].margin : undefined;

  function finish() {
    seedCards(lesson.cards.map((c) => c.id));
    if (!already) {
      addXp(25);
      setGained((g) => g + 25);
    }
    completeLesson(lesson.id);
    if (misses === 0 && lesson.paper.length) addBadge("sem-erros:" + lesson.id);
  }

  if (gate) {
    return (
      <div className="gate">
        <h1>{lesson.title}</h1>
        <p className="lead">Primeiro a leitura, depois os exercícios no caderno.</p>
        <ol className="steps2">
          <li className="now">
            <b>Ler</b> {lesson.book}
          </li>
          <li>
            <b>Exercícios</b> no seu caderno
          </li>
        </ol>
        <div className="row">
          <Link className="btn pen" href={readHref(lesson.book, lesson.id)!}>
            Ler o trecho agora
          </Link>
          <button className="btn ghost" onClick={() => markRead(lesson.id)}>
            Já conheço, ir aos exercícios
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lesson">
      <div className="stage">
        <Stepper n={steps.length} cur={cur} />
        {cur === 0 && (
          <header className="lesson-head">
            <h1>{lesson.title}</h1>
            <p className="where">
              Cerca de {lesson.minutes} min · no livro: {lesson.book}
              {articleLink(lesson.book) && (
                <>
                  {" "}
                  ·{" "}
                  <Link href={articleLink(lesson.book)!} target="_blank">
                    ler este trecho
                  </Link>
                </>
              )}
            </p>
            <Rich as="p" className="hook" html={lesson.hook} />
          </header>
        )}

        {step.t === "predict" && lesson.predict && (
          <section>
            <h2>Chute antes de aprender</h2>
            <Choice
              xp
              intro={lesson.predict.q}
              options={lesson.predict.options}
              answer={lesson.predict.answer}
              why={lesson.predict.why}
              onDone={() => advance(5)}
            />
          </section>
        )}

        {step.t === "slide" && (
          <section>
            <BlockView b={blocks[step.i]} open={energy === "deep"} />
            <div className="foot">
              {cur > 0 && (
                <button className="btn ghost" onClick={() => setCur(cur - 1)}>
                  Voltar
                </button>
              )}
              <button
                className="btn"
                onClick={() => advance(step.i === blocks.length - 1 ? 10 : 0)}
              >
                Entendi, continuar
              </button>
            </div>
          </section>
        )}

        {step.t === "notebook" && (
          <section>
            <NotebookStep
              key={lesson.paper[step.i].id}
              p={lesson.paper[step.i]}
              onDone={(score, conf) => {
                const ok = score >= 0.7;
                recordCalib(conf, ok);
                const calibrated = conf === 1 || (conf === 2) === ok;
                if (score < 1) {
                  seedCards(["p:" + lesson.paper[step.i].id]);
                  gradeCard("p:" + lesson.paper[step.i].id, "miss");
                  setMisses((m) => m + 1);
                }
                advance(Math.round(20 * score) + 5 + (calibrated ? 10 : 0));
              }}
            />
          </section>
        )}

        {step.t === "spot" && lesson.spot && (
          <section>
            <h2>Ache o passo errado</h2>
            <Choice
              intro={lesson.spot.intro}
              options={lesson.spot.steps}
              answer={lesson.spot.wrong}
              why={lesson.spot.why}
              onDone={(ok) => advance(ok ? 15 : 5)}
            />
          </section>
        )}

        {step.t === "end" && (
          <section className="reward">
            <p className="mute sans">{already ? "Revisão concluída" : "Lição concluída"}</p>
            <div className="xp">
              +{gained}
              <small>XP</small>
            </div>
            <p>
              {misses === 0
                ? "Você fechou o caderno sem nenhum desafio faltando."
                : `${misses} ${misses === 1 ? "desafio ficou" : "desafios ficaram"} na revisão. Eles voltam amanhã, curtos.`}
            </p>
            <div className="foot">
              {next && (
                <Link href={next.href} className="btn" onClick={finish}>
                  {next.label}
                </Link>
              )}
              <Link href="/" className="btn ghost" onClick={finish}>
                Voltar ao mapa
              </Link>
            </div>
            {lesson.deepDive && (
              <div className="blk deep" style={{ marginTop: 28 }}>
                <b className="sans">Quando valer abrir o livro</b>
                <Rich html={lesson.deepDive} />
                {articleLink(lesson.book) && (
                  <p>
                    <Link className="btn ghost sm" href={articleLink(lesson.book)!} target="_blank">
                      Ler este trecho no artigo
                    </Link>
                  </p>
                )}
              </div>
            )}
          </section>
        )}
      </div>
      <aside className="margin-col">
        {margin && (
          <div className="margin-note fadein">
            <Rich html={margin} />
          </div>
        )}
      </aside>
    </div>
  );
}

/* ——— chefão do capítulo: desafios misturados, sem dicas ——— */
export function BossRunner({
  chapterId,
  title,
  papers,
  cards,
  back,
}: {
  chapterId: string;
  title: string;
  papers: Paper[];
  cards: ReviewItem[];
  back: string;
}) {
  const queue = useMemo(() => {
    const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);
    const ps = shuffle(papers)
      .slice(0, 3)
      .map((p) => ({ t: "p" as const, p }));
    const cs = shuffle(cards)
      .slice(0, 4)
      .map((c) => ({ t: "c" as const, c }));
    return shuffle([...ps, ...cs]);
  }, [papers, cards]);
  const [i, setI] = useState(0);
  const [hits, setHits] = useState(0);
  const cur = queue[i];
  const next = (hit: boolean, xp: number) => {
    if (hit) setHits((h) => h + 1);
    addXp(xp);
    setI((v) => v + 1);
    window.scrollTo({ top: 0 });
  };
  const done = i >= queue.length;
  const won = hits >= Math.ceil(queue.length * 0.7);
  useEffect(() => {
    if (done && won) addBadge("chefao:" + chapterId);
  }, [done, won, chapterId]);

  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <p className="crumb">
        <Link href={back}>← Capítulo</Link>
      </p>
      <h1 style={{ fontSize: "2.2rem", margin: "8px 0 20px" }}>Chefão: {title}</h1>
      <Stepper n={queue.length} cur={Math.min(i, queue.length - 1)} />
      {!done && cur.t === "p" && (
        <NotebookStep
          key={cur.p.id}
          p={cur.p}
          hints={false}
          onDone={(score) => {
            if (score < 1) {
              seedCards(["p:" + cur.p.id]);
              gradeCard("p:" + cur.p.id, "miss");
            }
            next(score >= 0.7, Math.round(30 * score));
          }}
        />
      )}
      {!done && cur.t === "c" && (
        <ReviewCard
          key={cur.c.id}
          item={cur.c}
          onGrade={(r) => {
            gradeCard(cur.c.id, r);
            next(r === "hit", r === "hit" ? 15 : 3);
          }}
        />
      )}
      {done && (
        <section className="reward">
          <p className="mute sans">{won ? "Chefão derrotado" : "Quase lá"}</p>
          <div className="xp">
            {hits}
            <small>de {queue.length}</small>
          </div>
          <p>
            {won
              ? "Distintivo desbloqueado. O que faltou foi para a revisão."
              : "Nenhum prejuízo: o XP já está seu e o que faltou foi para a revisão. Volte quando quiser."}
          </p>
          <div className="foot">
            <Link href={back} className="btn">
              Voltar ao capítulo
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

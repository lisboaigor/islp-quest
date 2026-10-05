import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import type { Components } from "react-markdown";
import { headingId, type Article } from "@/lib/articles";
import { remarkCallouts } from "@/lib/remark-callouts";
import { remarkFigures } from "@/lib/remark-figures";
import { ReadingTools } from "./ReadingTools";
import { MissionBar } from "./MissionBar";

const text = (children: React.ReactNode): string =>
  Array.isArray(children)
    ? children.map(text).join("")
    : typeof children === "string"
      ? children
      : "";

const components: Components = {
  h2: ({ children }) => <h2 id={headingId(text(children))}>{children}</h2>,
  h3: ({ children }) => <h3 id={headingId(text(children))}>{children}</h3>,
  a: ({ href = "", children }) =>
    href.startsWith("#fig-") ? (
      <button type="button" className="figref" data-fig={href.slice(5)}>
        {children}
      </button>
    ) : href.startsWith("/") ? (
      <Link href={href}>{children}</Link>
    ) : (
      <a href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    ),
  table: ({ children }) => (
    <div className="table-wrap">
      <table>{children}</table>
    </div>
  ),
};

export function ArticleView({
  article,
  prev,
  next,
  mission,
}: {
  article: Article;
  prev?: { id: string; title: string };
  next?: { id: string; title: string };
  mission?: { id: string; title: string };
}) {
  return (
    <>
      <ReadingTools />
      {mission && <MissionBar lesson={mission} />}
      <article className="essay">
        <header className="essay-head">
          <p className="essay-meta">
            <Link href="/ler">Leitura</Link> · {article.minutes} min
          </p>
          <h1>{article.title}</h1>
          <p className="essay-sub">{article.subtitle}</p>
        </header>
        {article.headings.filter((h) => h.level === 2).length > 2 && (
          <nav className="essay-toc" aria-label="Neste capítulo">
            <p>Neste capítulo</p>
            <ol>
              {article.headings
                .filter((h) => h.level === 2)
                .map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`}>{h.text}</a>
                  </li>
                ))}
            </ol>
          </nav>
        )}
        <div className="essay-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath, remarkCallouts, remarkFigures]}
            rehypePlugins={[rehypeKatex]}
            components={components}
          >
            {article.body}
          </ReactMarkdown>
        </div>
        <footer className="essay-foot">
          <p>
            Hora de praticar no caderno:{" "}
            <Link href={`/c/${article.id}`}>abrir as missões deste capítulo</Link>.
          </p>
          <div className="essay-pager">
            {prev ? (
              <Link href={`/ler/${prev.id}`}>
                <small>Anterior</small>
                {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/ler/${next.id}`}>
                <small>Próximo</small>
                {next.title}
              </Link>
            ) : (
              <span />
            )}
          </div>
        </footer>
      </article>
    </>
  );
}

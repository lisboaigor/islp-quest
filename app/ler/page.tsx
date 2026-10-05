import Link from "next/link";
import { listArticleIds, loadArticle } from "@/lib/articles";

export const metadata = { title: "Leitura · ISLP Quest" };

export default function Page() {
  const items = listArticleIds()
    .map((id) => loadArticle(id)!)
    .filter(Boolean);
  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <h1>Leitura</h1>
      <p className="lead">
        O livro, capítulo a capítulo, escrito para ler na tela. As fórmulas e as ideias do original,
        sem precisar abrir o PDF.
      </p>
      <ol className="archive">
        {items.map((a) => (
          <li key={a.id}>
            <Link href={`/ler/${a.id}`}>
              <h2>{a.title}</h2>
              <p>{a.subtitle}</p>
              <span>{a.minutes} min de leitura</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

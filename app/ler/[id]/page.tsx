import { notFound } from "next/navigation";
import { ArticleView } from "@/components/ArticleView";
import { listArticleIds, loadArticle } from "@/lib/articles";
import { lessonById } from "@/content";

export function generateStaticParams() {
  return listArticleIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps<"/ler/[id]">) {
  const a = loadArticle((await params).id);
  return { title: a ? `${a.title} · ISLP Quest` : "Leitura" };
}

export default async function Page({ params, searchParams }: PageProps<"/ler/[id]">) {
  const { id } = await params;
  const { missao } = await searchParams;
  const lesson = typeof missao === "string" ? lessonById(missao) : undefined;
  const article = loadArticle(id);
  if (!article) notFound();
  const ids = listArticleIds();
  const i = ids.indexOf(id);
  const brief = (x?: string) => {
    const a = x ? loadArticle(x) : null;
    return a ? { id: a.id, title: a.title } : undefined;
  };
  return (
    <ArticleView
      article={article}
      prev={brief(ids[i - 1])}
      next={brief(ids[i + 1])}
      mission={lesson && { id: lesson.id, title: lesson.title }}
    />
  );
}

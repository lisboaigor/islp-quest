import { notFound } from "next/navigation";
import { CHAPTERS, allReviewItems, chapterById } from "@/content";
import { BossRunner } from "@/components/Runner";

export function generateStaticParams() {
  return CHAPTERS.map((c) => ({ id: c.id }));
}

export default async function Page({ params }: PageProps<"/boss/[id]">) {
  const { id } = await params;
  const ch = chapterById(id);
  if (!ch) notFound();
  const papers = ch.lessons.flatMap((l) => l.paper);
  const cards = allReviewItems().filter((i) => i.chapter === id && i.kind === "card");
  return (
    <BossRunner
      chapterId={ch.id}
      title={ch.title}
      papers={papers}
      cards={cards}
      back={`/c/${ch.id}`}
    />
  );
}

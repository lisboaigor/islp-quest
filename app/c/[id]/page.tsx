import { notFound } from "next/navigation";
import { CHAPTERS, chapterById } from "@/content";
import { ChapterTrail } from "@/components/ChapterTrail";

export function generateStaticParams() {
  return CHAPTERS.map((c) => ({ id: c.id }));
}

export default async function Page({ params }: PageProps<"/c/[id]">) {
  const { id } = await params;
  const chapter = chapterById(id);
  if (!chapter) notFound();
  return <ChapterTrail chapter={chapter} />;
}

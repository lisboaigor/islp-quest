import { notFound } from "next/navigation";
import { LESSONS, chapterOf, lessonById } from "@/content";
import { LessonRunner } from "@/components/Runner";

export function generateStaticParams() {
  return LESSONS.map((l) => ({ id: l.id }));
}

export default async function Page({ params }: PageProps<"/l/[id]">) {
  const { id } = await params;
  const lesson = lessonById(id);
  if (!lesson) notFound();
  const i = LESSONS.findIndex((l) => l.id === id);
  const nxt = LESSONS[i + 1];
  const ch = chapterOf(id)!;
  const lastInChapter = ch.lessons.length > 1 && ch.lessons[ch.lessons.length - 1].id === id;
  const next = lastInChapter
    ? { href: `/boss/${ch.id}`, label: "Enfrentar o chefão" }
    : nxt
      ? { href: `/l/${nxt.id}`, label: "Próxima lição" }
      : undefined;
  return (
    <div className="page">
      <LessonRunner lesson={lesson} next={next} />
    </div>
  );
}

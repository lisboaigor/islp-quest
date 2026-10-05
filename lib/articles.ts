import fs from "node:fs";
import path from "node:path";

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}
export interface Article {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  headings: Heading[];
  minutes: number;
}

/** "2.1.1 Por que estimar f" vira o id estável "s2-1-1"; títulos sem número viram slug. */
export function headingId(text: string): string {
  const m = text.match(/^(\d+(?:\.\d+)*)\s/);
  if (m) return "s" + m[1].replace(/\./g, "-");
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const strip = (s: string) => s.replace(/\*\*|\*|`|\$/g, "");

export function loadArticle(id: string): Article | null {
  const file = path.join(process.cwd(), "articles", `${id}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const [, front, body] = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/) ?? [];
  if (!front) return null;
  const meta = (k: string) => front.match(new RegExp(`^${k}:\\s*(.+)$`, "m"))?.[1].trim() ?? "";
  const headings: Heading[] = [];
  for (const line of body.split("\n")) {
    const m = line.match(/^(##|###)\s+(.+)$/);
    if (m)
      headings.push({
        id: headingId(strip(m[2])),
        text: strip(m[2]),
        level: m[1] === "##" ? 2 : 3,
      });
  }
  const words = body
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/\$[^$\n]*\$/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return {
    id,
    title: meta("title"),
    subtitle: meta("subtitle"),
    body,
    headings,
    minutes: Math.max(1, Math.round(words / 200)),
  };
}

export function listArticleIds(): string[] {
  const dir = path.join(process.cwd(), "articles");
  return fs.existsSync(dir)
    ? fs
        .readdirSync(dir)
        .filter((f) => /^ch\d+\.md$/.test(f))
        .map((f) => f.replace(".md", ""))
        .sort()
    : [];
}

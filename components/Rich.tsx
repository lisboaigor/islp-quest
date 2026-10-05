import katex from "katex";
import { linkifyFigures } from "@/lib/figure-refs";

function tex(src: string, display: boolean) {
  try {
    return katex.renderToString(src, { displayMode: display, throwOnError: false, strict: false });
  } catch {
    return src;
  }
}

/** Converte $$..$$ e $..$ em KaTeX; o resto é HTML simples escrito por nós. */
export function render(src: string) {
  return linkifyFigures(src)
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, m) => tex(m, true))
    .replace(/\$([^$\n]+?)\$/g, (_, m) => tex(m, false));
}

export function Rich({
  html,
  className,
  as: Tag = "div",
}: {
  html: string;
  className?: string;
  as?: "div" | "span" | "p";
}) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: render(html) }} />;
}

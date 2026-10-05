import { splitFigures } from "./figure-refs";

type Node = { type: string; value?: string; url?: string; children?: Node[] };
const SKIP = new Set(["link", "inlineCode", "code", "inlineMath", "math"]);

/** Transforma menções a “Figura X.Y” em links `#fig-X.Y`, que o ArticleView renderiza como botões. */
export function remarkFigures() {
  return (tree: Node) => {
    const walk = (n: Node) => {
      if (!n.children || SKIP.has(n.type)) return;
      const next: Node[] = [];
      for (const c of n.children) {
        if (c.type === "text" && c.value) {
          for (const p of splitFigures(c.value)) {
            next.push(
              "fig" in p
                ? {
                    type: "link",
                    url: `#fig-${p.fig}`,
                    children: [{ type: "text", value: p.text }],
                  }
                : { type: "text", value: p.text },
            );
          }
        } else {
          walk(c);
          next.push(c);
        }
      }
      n.children = next;
    };
    walk(tree);
  };
}

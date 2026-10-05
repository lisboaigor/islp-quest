/* Blockquotes iniciados por [!tipo] viram destaques estilizados (key, warn, lab, deep). */
type Node = { type: string; value?: string; children?: Node[]; data?: Record<string, unknown> };

export function remarkCallouts() {
  return (tree: Node) => {
    const walk = (n: Node) => {
      if (n.type === "blockquote" && n.children?.[0]?.type === "paragraph") {
        const first = n.children[0].children?.[0];
        const m =
          first?.type === "text" ? first.value?.match(/^\[!(key|warn|lab|deep)\]\s*/) : null;
        if (first && m) {
          first.value = first.value!.slice(m[0].length);
          n.data = { hProperties: { className: ["callout", m[1]] } };
        }
      }
      n.children?.forEach(walk);
    };
    walk(tree);
  };
}

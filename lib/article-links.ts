// Seguro para componentes de cliente (sem acesso ao sistema de arquivos).
/** Link para o trecho do artigo a partir de “Seção 2.1.1, pp. 15–20” ou “Seções 2.1.2–2.1.3, …”. */
export function articleLink(book: string): string | undefined {
  const m = book.match(/(?:Seção|Seções)\s+(\d+)((?:\.\d+)*)/);
  if (m) return `/ler/ch${m[1].padStart(2, "0")}#s${(m[1] + m[2]).replace(/\./g, "-")}`;
  const c = book.match(/Cap\.\s*(\d+)/);
  return c ? `/ler/ch${c[1].padStart(2, "0")}` : undefined;
}

/** Leva à seção do artigo certa para a missão, com a barra “Terminei de ler”. */
export function readHref(book: string, lessonId: string): string | undefined {
  const l = articleLink(book);
  if (!l) return undefined;
  const [path, hash] = l.split("#");
  return `${path}?missao=${lessonId}${hash ? "#" + hash : ""}`;
}

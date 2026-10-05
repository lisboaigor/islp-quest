// Valida o conteúdo: IDs únicos e fórmulas KaTeX sem erro de sintaxe.
import ts from "typescript";
import katex from "katex";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const dir = "content";
const files = fs
  .readdirSync(dir)
  .filter((f) => /^ch\d+\.ts$/.test(f))
  .sort();
const ids = new Map();
let errors = 0,
  formulas = 0,
  lessons = 0,
  papers = 0,
  cards = 0;

const dup = (kind, id, where) => {
  const k = kind + ":" + id;
  if (ids.has(k)) {
    console.error(`ID duplicado ${k} em ${where} e ${ids.get(k)}`);
    errors++;
  }
  ids.set(k, where);
};

function checkMath(str, where) {
  const re = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
  let m;
  while ((m = re.exec(str))) {
    formulas++;
    try {
      katex.renderToString(m[1] ?? m[2], {
        displayMode: !!m[1],
        throwOnError: true,
        strict: "ignore",
      });
    } catch (e) {
      errors++;
      console.error(
        `KaTeX em ${where}: ${String(e.message).slice(0, 110)}\n   ${(m[1] ?? m[2]).slice(0, 90)}`,
      );
    }
  }
  // cifrão solto indica fórmula mal fechada
  const stripped = str.replace(/\$\$[\s\S]+?\$\$/g, "").replace(/\$[^$\n]+?\$/g, "");
  if (stripped.includes("$")) {
    errors++;
    console.error(`Cifrão solto em ${where}: ${str.slice(0, 80)}`);
  }
}
function walk(v, where) {
  if (typeof v === "string") return checkMath(v, where);
  if (Array.isArray(v)) return v.forEach((x, i) => walk(x, where + `[${i}]`));
  if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, where + "." + k);
}

for (const f of files) {
  const src = fs.readFileSync(path.join(dir, f), "utf8");
  const js = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const mod = { exports: {} };
  vm.runInNewContext(js, { module: mod, exports: mod.exports, require: () => ({}), String });
  const ch = mod.exports.default;
  for (const l of ch.lessons) {
    lessons++;
    dup("lesson", l.id, f);
    l.paper.forEach((p) => {
      papers++;
      dup("paper", p.id, f);
      if (!p.rubric.length || !p.hints.length) {
        errors++;
        console.error("Sem rubrica/dica:", p.id);
      }
    });
    l.cards.forEach((c) => {
      cards++;
      dup("card", c.id, f);
    });
    if (l.spot && (l.spot.wrong < 0 || l.spot.wrong >= l.spot.steps.length)) {
      errors++;
      console.error("spot.wrong inválido:", l.id);
    }
    if (l.predict && (l.predict.answer < 0 || l.predict.answer >= l.predict.options.length)) {
      errors++;
      console.error("predict.answer inválido:", l.id);
    }
    walk(l, l.id);
  }
}
// ——— artigos ———
const headingId = (t) => {
  const m = t.match(/^(\d+(?:\.\d+)*)\s/);
  return m ? "s" + m[1].replace(/\./g, "-") : null;
};
const articleLink = (book) => {
  const m = book.match(/(?:Seção|Seções)\s+(\d+)((?:\.\d+)*)/);
  if (m) return { ch: "ch" + m[1].padStart(2, "0"), id: "s" + (m[1] + m[2]).replace(/\./g, "-") };
  const c = book.match(/Cap\.\s*(\d+)/);
  return c ? { ch: "ch" + c[1].padStart(2, "0") } : null;
};
const lessonIds = new Set(
  [...ids.keys()].filter((k) => k.startsWith("lesson:")).map((k) => k.slice(7)),
);
const anchors = {};
let articlesN = 0;
for (const f of fs
  .readdirSync("articles")
  .filter((x) => /^ch\d+\.md$/.test(x))
  .sort()) {
  articlesN++;
  const id = f.replace(".md", "");
  const raw = fs.readFileSync(path.join("articles", f), "utf8");
  if (!/^---\ntitle: .+\nsubtitle: .+\n---\n/.test(raw)) {
    errors++;
    console.error("Frontmatter inválido:", f);
  }
  anchors[id] = new Set();
  for (const line of raw.split("\n")) {
    const m = line.match(/^#{2,3}\s+(.+)$/);
    if (m) {
      const a = headingId(m[1].replace(/[*`$]/g, ""));
      if (a) anchors[id].add(a);
    }
  }
  checkMath(raw, f);
  for (const m of raw.matchAll(/\]\(\/l\/([a-z0-9-]+)\)/g))
    if (!lessonIds.has(m[1])) {
      errors++;
      console.error(`Link para lição inexistente em ${f}: ${m[1]}`);
    }
}
for (const f of files) {
  const src = fs.readFileSync(path.join(dir, f), "utf8");
  for (const m of src.matchAll(/book:\s*"([^"]+)"/g)) {
    const l = articleLink(m[1]);
    if (!l) {
      errors++;
      console.error("Sem link de artigo:", m[1]);
      continue;
    }
    if (!anchors[l.ch]) {
      errors++;
      console.error("Artigo ausente:", l.ch);
      continue;
    }
    if (l.id && !anchors[l.ch].has(l.id)) {
      errors++;
      console.error(`Âncora ausente no artigo ${l.ch}: ${l.id} (de “${m[1]}”)`);
    }
  }
}
const catalog = JSON.parse(fs.readFileSync("lib/figures.json", "utf8"));
let figRefs = 0;
const figRe = /\b(?:Figuras?|Figs?\.)\s+(\d{1,2}\.\d{1,2})((?:\s*(?:,|e|a)\s*\d{1,2}\.\d{1,2})*)/g;
const scan = (txt, where) => {
  for (const m of txt.matchAll(figRe))
    for (const n of [m[1], ...(m[2].match(/\d{1,2}\.\d{1,2}/g) ?? [])]) {
      figRefs++;
      if (!catalog[n]) {
        errors++;
        console.error(`Figura ${n} não existe no catálogo (${where})`);
      }
    }
};
for (const f of fs.readdirSync("articles"))
  scan(fs.readFileSync(path.join("articles", f), "utf8"), f);
for (const f of files) scan(fs.readFileSync(path.join(dir, f), "utf8"), f);
console.log(
  `${figRefs} referências a figuras verificadas (${Object.keys(catalog).length} no catálogo).`,
);
if (!/book:\s*"/.test(files.map((f) => fs.readFileSync(path.join(dir, f), "utf8")).join("\n"))) {
  errors++;
  console.error(
    "Nenhuma referência book: encontrada; o verificador de âncoras não está validando nada.",
  );
}
console.log(`${articlesN} artigos verificados.`);
console.log(
  `${files.length} capítulos, ${lessons} lições, ${papers} desafios de caderno, ${cards} cartas, ${formulas} fórmulas verificadas, ${errors} erro(s).`,
);
process.exit(errors ? 1 : 0);

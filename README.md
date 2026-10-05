# ISLP Quest

Plataforma de estudo gamificada para *An Introduction to Statistical Learning with Python*.
Todo o conteúdo está em português e foi escrito a partir do livro (`../ISLP_website.pdf`).

## Rodar

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm check        # valida conteúdo (IDs, fórmulas KaTeX), tipos e lint
```

## Como o estudo funciona

- **Mapa:** cada ponto é uma lição; a curva se ajusta aos pontos que você concluiu.
- **Lição:** palpite → blocos curtos de explicação (um por vez) → desafios para o **seu caderno** → caça ao erro → cartas.
- **Caderno:** o app diz o que resolver, você resolve à mão, informa sua confiança, vê a solução e confere por marcos.
  O que faltar volta na **revisão espaçada** (caixas de Leitner, capítulos misturados).
- **Energia:** pouca / normal / hiperfoco ajusta a quantidade de conteúdo da lição.
- **Chefão** ao fim de cada capítulo: desafios misturados, sem dicas.
- **Ideia solta:** anota uma tangente sem sair da tarefa.
- **Leitura:** `/ler` tem um artigo por capítulo, escrito em português simples para ler na tela (estilo Substack/Medium): resumo em uma frase, intuição antes da fórmula, destaques de cuidado, caixas "Para o caderno" ligadas às missões e vocabulário no fim. Cada lição liga ao trecho certo do artigo.

## Onde ficam os dados

O progresso (XP, lições lidas e concluídas, revisão espaçada, calibração, dias estudados, ideias soltas) fica num banco **SQLite** em `data/islp.db` (fora do git), acessado pela rota `/api/state`.

- Usa o `node:sqlite` embutido no Node (22.5 ou mais novo; sem dependência nativa).
- Para usar outro arquivo: `ISLP_DB=/caminho/progresso.db pnpm dev`.
- O `localStorage` do navegador funciona só como cache. Na primeira abertura com o banco vazio, o progresso que já estava no navegador é migrado para o banco. Se banco e navegador divergirem, vale o banco, e a versão do navegador fica em `islp-quest-v2-backup`.
- **Backup:** copie `data/islp.db` (e `islp.db-wal` / `islp.db-shm`, se existirem) com o servidor parado.
- **Zerar:** pare o servidor, apague `data/`, e limpe os dados do site no navegador (senão o cache reenvia o progresso antigo).
- A rota só aceita escrita da própria origem e não tem login: use em `localhost`, sem expor na rede.
- O tamanho do texto de leitura fica em `localStorage` (`islp-reading-size`), por navegador.

## Adicionar conteúdo

- **Missões:** `content/chNN.ts` (tipos em `lib/types.ts`), registradas em `content/index.ts`.
- **Artigos:** `articles/chNN.md`, com `title` e `subtitle` no cabeçalho. Títulos `## 2.1 ...` e `### 2.1.1 ...` geram âncoras (`#s2-1-1`) usadas pelos links das lições. Destaques: `> [!key]`, `> [!warn]`, `> [!lab]`, `> [!deep]`.
- `pnpm check` valida fórmulas KaTeX, IDs, links para lições e âncoras de seção.
- Para verificar um build sem mexer no servidor de desenvolvimento: `NEXT_DIST_DIR=.next-verify pnpm build`.

## O livro (PDF) e os direitos autorais

Este projeto é um material de estudo baseado em *An Introduction to Statistical Learning, with Applications in Python* (James, Witten, Hastie, Tibshirani e Taylor). Os artigos e as missões são adaptações em português escritas a partir do livro, não o texto original, e não têm vínculo com os autores nem com a editora. Quem quiser o livro completo deve obtê-lo no site oficial dos autores ([statlearning.com](https://www.statlearning.com/)).

O PDF **não** faz parte deste repositório. O modal de figuras abre `/livro.pdf`; para ativá-lo, baixe o PDF na [página de download oficial](https://hastie.su.domains/ISLP/ISLP_website.pdf.download.html) e salve-o como `public/livro.pdf` (o arquivo é ignorado pelo git). Sem ele, o resto do app funciona normalmente e só o modal de figuras fica sem conteúdo.

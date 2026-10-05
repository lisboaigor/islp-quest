import type { Chapter } from "@/lib/types";
const r = String.raw;

const ch: Chapter = {
  id: "ch01",
  num: 1,
  title: "Mapa do livro",
  pages: "pp. 1–14",
  blurb: "Três problemas que o livro inteiro resolve, e como estudar sem se perder.",
  lessons: [
    {
      id: "ch01-mapa",
      title: "O que o livro resolve e como ele se organiza",
      minutes: 8,
      book: "Cap. 1, pp. 1–14",
      hook: "Salário, bolsa de valores e genes: três perguntas diferentes, uma mesma linguagem.",
      predict: {
        q: "Uma pesquisadora tem expressão de 6.830 genes para 64 linhagens de câncer, mas nenhum rótulo dizendo o tipo de cada uma. Qual é o objetivo mais natural?",
        options: [
          "Prever o salário de cada linhagem",
          "Descobrir grupos de linhagens parecidas entre si",
          "Prever se a bolsa sobe ou desce",
        ],
        answer: 1,
        why: r`Sem rótulo de resposta, só dá para procurar estrutura nos próprios dados: agrupar. O livro chama isso de <b>aprendizado não supervisionado</b> (conjunto NCI60).`,
      },
      blocks: [
        {
          kind: "text",
          title: "Três problemas, três tipos de resposta",
          body: r`<p>O capítulo 1 apresenta três conjuntos de dados que reaparecem no livro todo:</p>
<p><b>Wage:</b> renda de homens da região Atlântico-Central dos EUA. Queremos entender como o salário depende de idade, escolaridade e ano. A resposta é um número: <b>regressão</b>.</p>
<p><b>Smarket:</b> retornos diários do índice S&amp;P 500. Queremos prever se o mercado sobe (Up) ou desce (Down). A resposta é uma categoria: <b>classificação</b>.</p>
<p><b>NCI60:</b> expressão gênica de 64 linhagens de câncer. Não há resposta a prever; queremos descobrir grupos. É <b>aprendizado não supervisionado</b>.</p>`,
          margin:
            "Guarde esses três nomes. Quando um capítulo disser “nos dados Wage…”, você já sabe que é regressão.",
        },
        {
          kind: "key",
          title: "A ideia central",
          body: r`<p>Aprendizado estatístico é um conjunto de ferramentas para <b>entender dados</b>. Duas famílias: <b>supervisionado</b> (há uma resposta $Y$ para prever ou explicar a partir de $X$) e <b>não supervisionado</b> (só há $X$; procuramos estrutura).</p>`,
        },
        {
          kind: "text",
          title: "Como o livro se organiza",
          body: r`<p>Cap. 2 dá o vocabulário. Cap. 3 e 4 são os dois pilares lineares (regressão e classificação). Cap. 5 ensina a medir o erro de verdade (validação cruzada e bootstrap). Cap. 6 e 7 melhoram e flexibilizam o modelo linear. Cap. 8 a 10 trazem árvores, SVM e redes neurais. Cap. 11 trata dados de sobrevivência, Cap. 12 aprendizado não supervisionado e Cap. 13 testes múltiplos.</p>
<p>Cada capítulo termina com um <b>laboratório em Python</b> e exercícios. Aqui, o laboratório vira missão opcional: você roda no seu ambiente e compara com a previsão que fez no caderno.</p>`,
        },
        {
          kind: "analogy",
          title: "Uma imagem para guardar",
          body: r`<p>Pense em pontos soltos num gráfico. Aprender é encontrar uma curva que passe perto deles <i>sem decorar cada ponto</i>. O livro inteiro é variação disso: que tipo de curva, como escolher, como saber se ela vai funcionar com pontos novos.</p>`,
        },
        {
          kind: "deep",
          title: "Toca do coelho: por que Python e não R",
          body: r`<p>Esta é a edição ISLP, com laboratórios em Python (pacotes <code>statsmodels</code>, <code>scikit-learn</code> e o pacote <code>ISLP</code>). As ideias são idênticas às da versão em R. A seção “Notation and Simple Matrix Algebra” do capítulo 1 fixa a notação ($n$ observações, $p$ variáveis, $x_{ij}$) usada daqui para a frente.</p>`,
        },
      ],
      paper: [
        {
          id: "ch01-p1",
          prompt: r`<p>Pegue o caderno e escreva <b>quatro perguntas</b> sobre dados que você já tenha feito na vida (trabalho, estudo, curiosidade). Para cada uma, anote:</p><p>(a) existe uma resposta $Y$ a prever ou explicar? Se sim, é <b>número</b> (regressão) ou <b>categoria</b> (classificação)? Se não, é não supervisionado?<br>(b) o que seriam os preditores $X$?</p>`,
          hints: [
            "Tente começar por algo concreto: “quanto vou gastar no mês”, “esse e-mail é spam”, “quais clientes se parecem”.",
            "Se você consegue dizer “quero prever ___”, é supervisionado. Se só quer “ver o que aparece”, é não supervisionado.",
          ],
          solution: r`<p>Não há resposta única. Um exemplo de cada tipo:</p><p>• “Quanto vou gastar de energia em julho?” $Y$ numérico (regressão); $X$: temperatura, nº de pessoas em casa, consumo anterior.<br>• “Esse e-mail é spam?” $Y$ categórico (classificação); $X$: palavras, remetente, horário.<br>• “Que tipos de leitor existem no meu blog?” sem $Y$ (não supervisionado); $X$: páginas visitadas, tempo de leitura.</p>`,
          rubric: [
            "Cada pergunta tem um tipo identificado: regressão, classificação ou não supervisionado.",
            "Pelo menos uma pergunta de cada um dos dois grandes grupos (com e sem resposta $Y$).",
            "Para as supervisionadas, escrevi quais seriam os preditores $X$.",
          ],
        },
      ],
      cards: [
        {
          id: "ch01-c1",
          q: "Qual a diferença entre aprendizado supervisionado e não supervisionado?",
          a: r`Supervisionado: há resposta $Y$ para cada observação e queremos prevê-la ou explicá-la a partir de $X$. Não supervisionado: só há $X$; procuramos estrutura (grupos, padrões).`,
        },
        {
          id: "ch01-c2",
          q: "Wage, Smarket e NCI60: qual tipo de problema cada um ilustra?",
          a: "Wage: regressão (salário é número). Smarket: classificação (sobe ou desce). NCI60: não supervisionado (agrupar linhagens por expressão gênica).",
        },
      ],
      deepDive: r`A seção “A Brief History of Statistical Learning” (cap. 1) conta de onde vêm os métodos (mínimos quadrados no início do século XIX, análise discriminante linear em 1936, regressão logística nos anos 1940, redes neurais nos anos 1980…). Útil para contexto, não para prova.`,
    },
  ],
};
export default ch;

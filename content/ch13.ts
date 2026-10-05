import type { Chapter } from "@/lib/types";
const r = String.raw;

const ch: Chapter = {
  id: "ch13",
  num: 13,
  title: "Testes múltiplos",
  pages: "pp. 557–595",
  blurb: "Quando se testam centenas de hipóteses, 5% de falsos positivos deixa de ser aceitável.",
  lessons: [
    {
      id: "ch13-problema",
      title: "O problema dos testes múltiplos",
      minutes: 12,
      book: "Seções 13.1–13.2, pp. 558–565",
      hook: "Teste 100 hipóteses nulas verdadeiras e quase certamente você “descobre” algo.",
      predict: {
        q: "Você testa $m=100$ hipóteses nulas verdadeiras e independentes, cada uma a 5%. Quantas esperar rejeitadas por acaso?",
        options: ["Nenhuma", "Cerca de 5", "Cerca de 50"],
        answer: 1,
        why: r`Cada teste rejeita uma nula verdadeira com probabilidade 0,05, então se esperam $100\times0{,}05=5$ falsos positivos.`,
      },
      blocks: [
        {
          kind: "text",
          title: "Revisão: erros de tipo I e II",
          body: r`<p>Testamos $H_0$ contra $H_a$ com um p-valor, e rejeitamos se $p\le\alpha$. <b>Erro de tipo I</b>: rejeitar uma $H_0$ verdadeira (falso positivo); controlado em $\alpha$. <b>Erro de tipo II</b>: não rejeitar uma $H_0$ falsa. <b>Poder</b> $=1-\Pr(\text{tipo II})$.</p>`,
        },
        {
          kind: "key",
          title: "Por que o erro se acumula",
          body: r`<p>Com $m$ testes independentes, todos com $H_0$ verdadeira, a probabilidade de <b>pelo menos um</b> falso positivo é</p>$$1-(1-\alpha)^m.$$<p>Cresce rápido com $m$. Em genética ou análise de dados com muitos preditores, é comum testar milhares de hipóteses.</p>`,
        },
        {
          kind: "text",
          title: "As contagens do jogo",
          body: r`<p>Entre $m$ hipóteses: $V$ = falsos positivos, $S$ = verdadeiros positivos, $R=V+S$ = total de rejeições. Duas formas de controlar o erro: a <b>taxa de erro por família</b> (FWER, $\Pr(V\ge1)$) e a <b>taxa de falsas descobertas</b> (FDR, $E(V/R)$).</p>`,
        },
      ],
      paper: [
        {
          id: "ch13-prob-p1",
          prompt: r`<p>Para $\alpha=0{,}05$: (a) Qual a probabilidade de pelo menos um falso positivo com $m=1$, $m=10$ e $m=100$ testes independentes de nulas verdadeiras? (b) Quantos testes são necessários para essa probabilidade passar de 50%?</p>`,
          hints: [r`$1-0{,}95^m$. Para (b): $0{,}95^m<0{,}5\Rightarrow m>\ln0{,}5/\ln0{,}95$.`],
          solution: r`<p>(a) $m=1$: $0{,}05$. $m=10$: $1-0{,}95^{10}\approx0{,}401$. $m=100$: $1-0{,}95^{100}\approx0{,}994$.<br>(b) $m>\ln0{,}5/\ln0{,}95\approx13{,}5$, então a partir de $m=14$ testes.</p>`,
          rubric: ["0,05; 0,401; 0,994.", "$m\\ge14$ para passar de 50%."],
        },
      ],
      cards: [
        {
          id: "ch13-prob-c1",
          q: "Defina erro de tipo I, erro de tipo II e poder.",
          a: "Tipo I: rejeitar uma $H_0$ verdadeira. Tipo II: não rejeitar uma $H_0$ falsa. Poder: $1-\\Pr(\\text{tipo II})$, a chance de detectar um efeito real.",
        },
        {
          id: "ch13-prob-c2",
          q: "Probabilidade de pelo menos um falso positivo em $m$ testes independentes?",
          a: r`$1-(1-\alpha)^m$: por exemplo, $\approx0{,}994$ com $m=100$ e $\alpha=0{,}05$.`,
        },
        {
          id: "ch13-prob-c3",
          q: "Defina FWER e FDR.",
          a: r`FWER $=\Pr(V\ge1)$: probabilidade de ao menos um falso positivo. FDR $=E(V/R)$: proporção esperada de rejeições que são falsas.`,
        },
      ],
    },

    {
      id: "ch13-fwer",
      title: "Controlar o FWER: Bonferroni e Holm",
      minutes: 12,
      book: "Seção 13.3, pp. 565–573",
      hook: "Dois ajustes que exigem mais evidência de cada teste.",
      blocks: [
        {
          kind: "key",
          title: "Bonferroni",
          body: r`<p>Rejeite $H_{0j}$ se $p_j\le\alpha/m$. Garante $\text{FWER}\le\alpha$, qualquer que seja a dependência entre testes. É <b>conservador</b>: quanto maior $m$, mais difícil rejeitar, e o poder cai.</p>`,
        },
        {
          kind: "key",
          title: "Método de Holm",
          body: r`<p>Ordene os p-valores $p_{(1)}\le\dots\le p_{(m)}$. Ache o menor $L$ tal que $p_{(L)}>\dfrac{\alpha}{m+1-L}$. Rejeite as hipóteses com $p_{(j)}<p_{(L)}$ (as $L-1$ primeiras). Também controla o FWER, e <b>é sempre pelo menos tão poderoso</b> quanto Bonferroni, sem exigir suposições a mais.</p>`,
          margin:
            "Os limiares do Holm são $\\alpha/m$, $\\alpha/(m-1)$, ..., $\\alpha/1$, crescentes: o primeiro é o de Bonferroni.",
        },
        {
          kind: "warn",
          title: "Compromisso",
          body: r`<p>Controlar o FWER protege contra <i>qualquer</i> falso positivo, mas a um custo de poder. Em estudos exploratórios com milhares de hipóteses, isso costuma ser rígido demais, o que motiva o FDR.</p>`,
        },
      ],
      paper: [
        {
          id: "ch13-fwer-p1",
          prompt: r`<p>$m=5$, $\alpha=0{,}05$, p-valores ordenados: $0{,}001;\ 0{,}012;\ 0{,}020;\ 0{,}040;\ 0{,}300$. (a) Quais Bonferroni rejeita? (b) Aplique Holm passo a passo (limiares $\alpha/(m+1-j)$). (c) Compare.</p>`,
          hints: [
            r`Bonferroni: limiar $0{,}05/5=0{,}01$. Holm: $0{,}01;\ 0{,}0125;\ 0{,}0167;\ 0{,}025;\ 0{,}05$.`,
          ],
          solution: r`<p>(a) Limiar $0{,}01$: só $0{,}001$ é rejeitado (1 hipótese).<br>(b) Holm: $j=1$: $0{,}001\le0{,}05/5=0{,}01$ ✓; $j=2$: $0{,}012\le0{,}05/4=0{,}0125$ ✓; $j=3$: $0{,}020>0{,}05/3=0{,}0167$ ✗, então $L=3$ e rejeitam-se as 2 primeiras.<br>(c) Holm rejeita 2, Bonferroni só 1: mais poder com o mesmo controle de FWER.</p>`,
          rubric: [
            "Bonferroni rejeita só 0,001.",
            "Holm rejeita 0,001 e 0,012 e para em 0,020.",
            "Concluí que Holm tem mais poder.",
          ],
        },
      ],
      cards: [
        {
          id: "ch13-fwer-c1",
          q: "Regra do Bonferroni e seu defeito.",
          a: r`Rejeitar se $p_j\le\alpha/m$. Controla o FWER, mas é conservador: com $m$ grande quase nada é rejeitado.`,
        },
        {
          id: "ch13-fwer-c2",
          q: "Descreva o método de Holm.",
          a: r`Ordene os p-valores, ache o menor $L$ com $p_{(L)}>\alpha/(m+1-L)$ e rejeite os $L-1$ primeiros. Controla o FWER e é mais poderoso que Bonferroni.`,
        },
      ],
      deepDive: r`A Seção 13.3.3 (p. 572) discute o compromisso entre FWER e poder com um exemplo gráfico da fração de hipóteses nulas falsas que cada método detecta.`,
    },

    {
      id: "ch13-fdr",
      title: "Falsas descobertas: o procedimento de Benjamini–Hochberg",
      minutes: 12,
      book: "Seção 13.4, pp. 573–578",
      hook: "Aceitar alguns falsos positivos, mas controlar a proporção deles entre as descobertas.",
      blocks: [
        {
          kind: "key",
          title: "FDR",
          body: r`<p>$\text{FDR}=E(V/R)$: entre as hipóteses que rejeitamos, a proporção esperada de rejeições falsas. Fixar $q=0{,}1$ diz que aceitamos que cerca de 10% das descobertas sejam falsas. Mais adequado quando se faz triagem de muitas hipóteses (genes, por exemplo) para investigar depois.</p>`,
        },
        {
          kind: "key",
          title: "Benjamini–Hochberg",
          body: r`<p>Ordene os p-valores e ache o <b>maior</b> $L$ tal que</p>$$p_{(L)}<\frac{q\,L}{m}.$$<p>Rejeite todas as hipóteses com $p_j\le p_{(L)}$. Controla o FDR em $q$ se os testes são independentes (ou sob certas dependências).</p>`,
        },
        {
          kind: "warn",
          title: "Cuidado",
          body: r`<p>No Holm procura-se o <i>menor</i> $L$ que <b>falha</b>; no BH, o <b>maior</b> $L$ que <b>passa</b>. Isso é um erro comum de trocar. E o BH controla uma coisa diferente (FDR), não o FWER.</p>`,
        },
      ],
      paper: [
        {
          id: "ch13-fdr-p1",
          prompt: r`<p>Mesmos p-valores: $0{,}001;\,0{,}012;\,0{,}020;\,0{,}040;\,0{,}300$, com $m=5$ e $q=0{,}05$. (a) Calcule os limiares $qL/m$. (b) Ache o maior $L$ que satisfaz $p_{(L)}\le qL/m$. (c) Quantas hipóteses são rejeitadas? Compare com Bonferroni e Holm.</p>`,
          hints: [r`Limiares: $0{,}01;\ 0{,}02;\ 0{,}03;\ 0{,}04;\ 0{,}05$.`],
          solution: r`<p>(a) $0{,}01;\ 0{,}02;\ 0{,}03;\ 0{,}04;\ 0{,}05$.<br>(b) $p_{(1)}=0{,}001\le0{,}01$ ✓; $p_{(2)}=0{,}012\le0{,}02$ ✓; $p_{(3)}=0{,}020\le0{,}03$ ✓; $p_{(4)}=0{,}040\le0{,}04$ ✓ (igualdade); $p_{(5)}=0{,}300>0{,}05$ ✗. Maior $L=4$.<br>(c) Rejeitam-se <b>4</b> (Bonferroni: 1; Holm: 2). O BH é bem mais liberal porque controla uma garantia mais fraca (FDR, não FWER).</p>`,
          rubric: [
            "Limiares 0,01 a 0,05.",
            "$L=4$ (incluindo a igualdade em 0,040).",
            "BH rejeita 4, contra 2 (Holm) e 1 (Bonferroni).",
          ],
        },
      ],
      cards: [
        {
          id: "ch13-fdr-c1",
          q: "O que é FDR e quando usá-lo em vez do FWER?",
          a: r`$\text{FDR}=E(V/R)$, a proporção esperada de falsas descobertas entre as rejeições. Útil em triagem de muitas hipóteses, aceitando alguns falsos positivos.`,
        },
        {
          id: "ch13-fdr-c2",
          q: "Regra do Benjamini–Hochberg.",
          a: r`Ache o maior $L$ com $p_{(L)}\le qL/m$ e rejeite todos os $p_j\le p_{(L)}$.`,
        },
        {
          id: "ch13-fdr-c3",
          q: "Ordene por rigor: Bonferroni, Holm e BH.",
          a: "Bonferroni é o mais rigoroso, Holm é um pouco menos, e BH é o mais liberal (controla FDR em vez de FWER).",
        },
      ],
      deepDive: r`A Seção 13.5 (pp. 577–582) apresenta abordagens por <b>reamostragem</b> (permutação) para p-valores e FDR quando a distribuição teórica da estatística é duvidosa, e a 13.6 (pp. 583–592) traz o laboratório em Python.`,
    },
  ],
};
export default ch;

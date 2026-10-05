import type { Chapter } from "@/lib/types";
const r = String.raw;

const ch: Chapter = {
  id: "ch07",
  num: 7,
  title: "Além da linearidade",
  pages: "pp. 289–329",
  blurb: "Polinômios, degraus, splines, regressão local e modelos aditivos (GAMs).",
  lessons: [
    {
      id: "ch07-bases",
      title: "Polinômios, funções degrau e funções base",
      minutes: 12,
      book: "Seções 7.1–7.3, pp. 290–294",
      hook: "Dá para ser flexível sem sair da regressão linear: transforme os preditores.",
      blocks: [
        {
          kind: "key",
          title: "Regressão polinomial",
          body: r`$$y_i=\beta_0+\beta_1x_i+\beta_2x_i^2+\dots+\beta_dx_i^d+\varepsilon_i.$$<p>Continua sendo mínimos quadrados, com $x,x^2,\dots,x^d$ como preditores. Raramente se usa $d>3$ ou $4$: a curva fica muito flexível e instável, sobretudo nas bordas, onde há pouca informação.</p>`,
        },
        {
          kind: "key",
          title: "Funções degrau",
          body: r`<p>Escolha pontos de corte $c_1<\dots<c_K$, formando $K+1$ intervalos, e crie indicadores $C_k(X)=I(c_k\le X<c_{k+1})$. O modelo</p>$$y_i=\beta_0+\beta_1C_1(x_i)+\dots+\beta_KC_K(x_i)+\varepsilon_i$$<p>ajusta uma <b>constante por intervalo</b>. $\beta_0$ é a média de $Y$ quando $X<c_1$ e cada $\beta_k$ é o acréscimo em relação a ela. Como $\sum_kC_k=1$, um indicador fica de fora.</p>`,
          margin:
            "Defeito: se não há pontos de corte naturais, a função degrau perde a tendência entre os cortes.",
        },
        {
          kind: "text",
          title: "Funções base",
          body: r`<p>Polinômios e degraus são casos de uma ideia geral: escolher funções fixas $b_1(X),\dots,b_K(X)$ e ajustar $y_i=\beta_0+\beta_1b_1(x_i)+\dots+\beta_Kb_K(x_i)+\varepsilon_i$. Como o modelo é linear nos $\beta_j$, valem erros-padrão, testes e F do Capítulo 3. Splines e wavelets usam outras bases.</p>`,
        },
      ],
      paper: [
        {
          id: "ch07-bases-p1",
          prompt: r`<p>Cortes em $c_1=30$ e $c_2=50$ para a idade. Médias observadas de $Y$: idade $<30$: $40$; $30\le$ idade $<50$: $55$; idade $\ge50$: $52$.</p><p>(a) Escreva o modelo degrau. (b) Quais são $\hat\beta_0,\hat\beta_1,\hat\beta_2$? (c) Qual a previsão para idade 45? (d) Quantos parâmetros tem um polinômio cúbico, e quantos o modelo degrau com 2 cortes?</p>`,
          hints: [
            r`Intervalos: $<30$ (referência), $[30,50)$ e $\ge50$. Cada $\hat\beta_k$ é a diferença da média do grupo para a referência.`,
          ],
          solution: r`<p>(a) $y=\beta_0+\beta_1I(30\le x<50)+\beta_2I(x\ge50)+\varepsilon$.<br>(b) $\hat\beta_0=40$, $\hat\beta_1=55-40=15$, $\hat\beta_2=52-40=12$.<br>(c) $40+15=55$.<br>(d) Cúbico: $4$ coeficientes (com intercepto). Degrau com 2 cortes: $3$.</p>`,
          rubric: [
            "Modelo com 2 indicadores e intercepto.",
            "$\\hat\\beta=(40,15,12)$.",
            "Previsão 55 para idade 45.",
            "4 versus 3 parâmetros.",
          ],
        },
      ],
      cards: [
        {
          id: "ch07-bases-c1",
          q: "Por que polinômios de grau alto são problemáticos?",
          a: "Ficam muito flexíveis e instáveis, com variância alta nas bordas, onde há poucos dados.",
        },
        {
          id: "ch07-bases-c2",
          q: "Como funciona a regressão com funções degrau?",
          a: r`Divide $X$ em $K+1$ intervalos por pontos de corte e ajusta uma constante em cada um, usando indicadores $C_k(X)$.`,
        },
        {
          id: "ch07-bases-c3",
          q: "O que é a abordagem de funções base?",
          a: r`Ajustar $y=\beta_0+\sum\beta_kb_k(x)$ com $b_k$ fixas e conhecidas. É linear nos $\beta$, então mínimos quadrados se aplica.`,
        },
      ],
    },

    {
      id: "ch07-splines",
      title: "Splines de regressão e splines de suavização",
      minutes: 16,
      book: "Seções 7.4–7.5, pp. 294–303",
      hook: "Pedaços de polinômios costurados com suavidade.",
      predict: {
        q: "Ao ajustar um polinômio por partes com $K$ nós, sem restrições, a função fica…",
        options: ["Contínua e suave", "Descontínua nos nós", "Sempre linear"],
        answer: 1,
        why: r`Sem restrições, cada pedaço é ajustado separadamente e há saltos nos nós. Splines acrescentam restrições de continuidade e de derivadas contínuas.`,
      },
      blocks: [
        {
          kind: "key",
          title: "Spline cúbico",
          body: r`<p>Divida $X$ por $K$ <b>nós</b> e ajuste um polinômio cúbico em cada região, exigindo que a função e suas <b>primeira e segunda derivadas sejam contínuas</b> nos nós. O resultado parece suave a olho nu. Um spline cúbico com $K$ nós usa $K+4$ graus de liberdade.</p>`,
        },
        {
          kind: "text",
          title: "A base de potências truncadas",
          body: r`<p>Representação: $y_i=\beta_0+\beta_1x_i+\beta_2x_i^2+\beta_3x_i^3+\beta_4h(x_i,\xi_1)+\dots+\beta_{K+3}h(x_i,\xi_K)$, com $h(x,\xi)=(x-\xi)^3$ se $x>\xi$ e $0$ caso contrário. Os nós costumam ficar nos <b>quantis</b> dos dados, e $K$ se escolhe por validação cruzada. O <b>spline natural</b> impõe que a função seja linear além dos nós de borda, o que reduz a variância nas extremidades.</p>`,
        },
        {
          kind: "key",
          title: "Spline de suavização",
          body: r`<p>Em vez de escolher nós, ache a função $g$ que minimize</p>$$\sum_{i=1}^n\big(y_i-g(x_i)\big)^2+\lambda\int g''(t)^2\,dt.$$<p>O primeiro termo ajusta os dados; o segundo <b>pune a rugosidade</b>. $\lambda=0$: $g$ interpola todos os pontos. $\lambda\to\infty$: $g''=0$, uma reta de mínimos quadrados. $\lambda$ se escolhe por validação cruzada (o LOOCV tem atalho aqui também).</p>`,
          margin:
            "O “grau de liberdade efetivo” $df_\\lambda$ vai de $n$ ($\\lambda=0$) a 2 ($\\lambda\\to\\infty$).",
        },
      ],
      paper: [
        {
          id: "ch07-spl-p1",
          prompt: r`<p>(a) Calcule $h(x,\xi)=(x-\xi)^3_+$ com $\xi=3$ para $x=5$ e $x=2$. (b) Quantos graus de liberdade tem um spline cúbico com $K=3$ nós? (c) Descreva, para $\lambda=0$, $\lambda$ muito grande e $\lambda$ intermediário, o comportamento do spline de suavização e o que ocorre com o viés e a variância.</p>`,
          hints: [r`(b) Spline cúbico com $K$ nós: $K+4$.`],
          solution: r`<p>(a) $x=5$: $(5-3)^3=8$. $x=2$: $0$ (está antes do nó).<br>(b) $K+4=7$.<br>(c) $\lambda=0$: $g$ passa por todos os pontos (viés baixo, variância altíssima, overfitting). $\lambda\to\infty$: reta de mínimos quadrados (viés alto, variância baixa). Intermediário: curva suave que captura a forma sem seguir o ruído; é o que a CV procura.</p>`,
          rubric: [
            "$h=8$ e $h=0$.",
            "7 graus de liberdade.",
            "$\\lambda=0$ interpola; $\\lambda\\to\\infty$ é reta; intermediário via CV, com a leitura viés-variância.",
          ],
        },
      ],
      cards: [
        {
          id: "ch07-spl-c1",
          q: "Que restrições definem um spline cúbico e quantos df tem com $K$ nós?",
          a: r`Função e primeira e segunda derivadas contínuas nos nós. $K+4$ graus de liberdade.`,
        },
        {
          id: "ch07-spl-c2",
          q: "O que é um spline natural e por que usá-lo?",
          a: "Spline com restrição de ser linear além dos nós de borda. Reduz a variância (instabilidade) nas extremidades.",
        },
        {
          id: "ch07-spl-c3",
          q: "Função objetivo do spline de suavização e papel de $\\lambda$.",
          a: r`$\sum(y_i-g(x_i))^2+\lambda\int g''^2$. $\lambda=0$ interpola; $\lambda\to\infty$ dá reta. Escolhido por CV.`,
        },
      ],
      deepDive: r`A Seção 7.4.5 (p. 299) compara splines e polinômios com o mesmo número de graus de liberdade nos dados Wage e mostra por que o spline é mais estável nas bordas.`,
    },

    {
      id: "ch07-local-gam",
      title: "Regressão local e modelos aditivos (GAMs)",
      minutes: 14,
      book: "Seções 7.6–7.7, pp. 303–309",
      hook: "Cada preditor ganha a sua própria curva, e as curvas se somam.",
      blocks: [
        {
          kind: "text",
          title: "Regressão local",
          body: r`<p>Para prever em $x_0$, use só os pontos de treino <b>vizinhos</b> (uma fração $s$ chamada <i>span</i>), com pesos que decrescem com a distância. Ajusta-se uma regressão ponderada e usa-se o valor em $x_0$. O span controla a flexibilidade: pequeno = curva rugosa; grande = curva suave.</p>`,
        },
        {
          kind: "key",
          title: "GAM: modelo aditivo generalizado",
          body: r`$$y_i=\beta_0+f_1(x_{i1})+f_2(x_{i2})+\dots+f_p(x_{ip})+\varepsilon_i.$$<p>Cada $f_j$ é uma função suave ajustada (spline, polinômio, regressão local). Os efeitos <b>se somam</b>. Para classificação usa-se o logit: $\log\frac{p}{1-p}=\beta_0+f_1(x_1)+\dots+f_p(x_p)$.</p>`,
        },
        {
          kind: "text",
          title: "Prós e contras",
          body: r`<p><b>Prós:</b> captura não linearidade sem testar transformações à mão; permite ver o efeito de cada $X_j$ mantendo os outros fixos; é mais interpretável que modelos totalmente flexíveis. <b>Contra:</b> a aditividade <b>esconde interações</b>; é possível acrescentar termos de interação manualmente, ou usar métodos como árvores.</p>`,
        },
      ],
      paper: [
        {
          id: "ch07-gam-p1",
          prompt: r`<p>GAM: $\hat y=2+f_1(x_1)+f_2(x_2)$ com $f_1(x_1)=0{,}5x_1$ e $f_2(x_2)=x_2^2$.</p><p>(a) Preveja para $x_1=4$, $x_2=3$. (b) Quanto muda $\hat y$ se $x_1$ vai de 4 a 6 com $x_2=3$? E com $x_2=0$? (c) O que isso diz sobre interações?</p>`,
          hints: [r`Aditivo significa que a variação em $x_1$ só passa por $f_1$.`],
          solution: r`<p>(a) $2+2+9=13$.<br>(b) $f_1(6)-f_1(4)=3-2=+1$ nos dois casos ($x_2=3$ ou $0$).<br>(c) O efeito de $x_1$ é o mesmo qualquer que seja $x_2$: um GAM aditivo <b>não captura interações</b> (para isso seria preciso um termo $f(x_1,x_2)$).</p>`,
          rubric: [
            "Previsão 13.",
            "Variação $+1$ independente de $x_2$.",
            "Concluí que modelos aditivos não captam interações.",
          ],
        },
        {
          id: "ch07-gam-p2",
          prompt: r`<p>Regressão local simplificada (média ponderada). Em $x_0=5$ com pontos $x=(3,4,5,6,8)$, $y=(4,5,7,6,10)$ e pesos $w_i=\max\big(0,\,1-|x_i-x_0|/3\big)$, calcule os pesos e a média ponderada de $y$.</p>`,
          hints: [r`Distâncias a 5: $2,1,0,1,3$.`],
          solution: r`<p>Pesos: $1/3;\ 2/3;\ 1;\ 2/3;\ 0$ (o ponto $x=8$ está fora da vizinhança). Soma dos pesos: $8/3\approx2{,}667$. Numerador: $4/3+10/3+7+4+0=15{,}667$. Média: $15{,}667/2{,}667\approx5{,}875$.</p><p>(Na regressão local de verdade ajusta-se uma <i>reta</i> ponderada em vez de uma constante, mas o mecanismo dos pesos é o mesmo.)</p>`,
          rubric: [
            "Pesos 1/3, 2/3, 1, 2/3, 0.",
            "Soma dos pesos $=8/3$.",
            "Média ponderada $\\approx5{,}875$.",
          ],
        },
      ],
      cards: [
        {
          id: "ch07-gam-c1",
          q: "Qual a forma de um GAM e sua principal limitação?",
          a: r`$y=\beta_0+\sum f_j(x_j)+\varepsilon$. Os efeitos são aditivos, então interações entre preditores não são captadas (a não ser que se adicionem).`,
        },
        {
          id: "ch07-gam-c2",
          q: "Como o span afeta a regressão local?",
          a: "Span pequeno: curva rugosa e flexível; span grande: curva suave, menos flexível.",
        },
      ],
      deepDive: r`A Seção 7.7.1 (pp. 305–308) mostra GAMs com splines naturais e suavização nos dados Wage (ano, idade, escolaridade) e como cada $f_j$ é desenhada com os demais fixos.`,
    },
  ],
};
export default ch;

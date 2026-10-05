import type { Chapter } from "@/lib/types";
const r = String.raw;

const ch: Chapter = {
  id: "ch09",
  num: 9,
  title: "Máquinas de vetores de suporte",
  pages: "pp. 367–397",
  blurb: "Hiperplanos, margem máxima, folgas e o truque dos kernels.",
  lessons: [
    {
      id: "ch09-margem",
      title: "Hiperplanos e o classificador de margem máxima",
      minutes: 14,
      book: "Seção 9.1, pp. 367–373",
      hook: "Entre infinitas retas que separam duas nuvens, escolher a que fica mais longe das duas.",
      blocks: [
        {
          kind: "key",
          title: "O hiperplano",
          body: r`<p>Em $p$ dimensões, um hiperplano é o conjunto de pontos com</p>$$\beta_0+\beta_1X_1+\dots+\beta_pX_p=0.$$<p>(em 2D é uma reta). Os dois lados são $f(x)>0$ e $f(x)<0$. Classificamos pelo <b>sinal</b> de $f(x)$, e $|f(x)|$ grande indica mais confiança: o ponto está longe da fronteira.</p>`,
        },
        {
          kind: "key",
          title: "Margem máxima",
          body: r`<p>Se existe um hiperplano que separa perfeitamente as classes ($y_i=\pm1$), existem infinitos. O <b>classificador de margem máxima</b> escolhe aquele cuja <b>margem</b> (menor distância das observações ao hiperplano) é máxima:</p>$$\max_{\beta,M}M\ \text{ sujeito a }\ \sum_j\beta_j^2=1,\ \ y_i(\beta_0+\beta_1x_{i1}+\dots+\beta_px_{ip})\ge M.$$<p>Com $\sum\beta_j^2=1$, $y_if(x_i)$ é a distância do ponto ao hiperplano.</p>`,
        },
        {
          kind: "text",
          title: "Vetores de suporte",
          body: r`<p>As observações mais próximas do hiperplano (sobre a margem) são os <b>vetores de suporte</b>. Só elas determinam o hiperplano: mover qualquer outra observação, sem cruzar a margem, não o altera. Se $p$ é grande, o classificador sofre overfitting, e se as classes não são separáveis ele não existe, o que leva à próxima lição.</p>`,
        },
      ],
      paper: [
        {
          id: "ch09-hp-p1",
          prompt: r`<p>Hiperplano $1+2x_1-x_2=0$. (a) Classifique pelo sinal os pontos $(1,1)$, $(0,3)$ e $(-2,-1)$. (b) Calcule a distância de $(1,1)$ ao hiperplano (fórmula: $|f(x)|/\sqrt{\sum\beta_j^2}$, com $\beta_1,\beta_2$). (c) Escreva o vetor normalizado $(\beta_1,\beta_2)$ de norma 1.</p>`,
          hints: [r`$f(1,1)=1+2-1$. A norma de $(2,-1)$ é $\sqrt5$.`],
          solution: r`<p>(a) $f(1,1)=1+2-1=2>0$ (lado positivo). $f(0,3)=1+0-3=-2<0$ (lado negativo). $f(-2,-1)=1-4+1=-2<0$ (negativo).<br>(b) $2/\sqrt5\approx0{,}894$.<br>(c) $(\beta_1,\beta_2)=(2,-1)/\sqrt5\approx(0{,}894;\,-0{,}447)$, com $\beta_0=1/\sqrt5$.</p>`,
          rubric: [
            "Sinais +, −, −.",
            "Distância $\\approx0{,}894$.",
            "Normalizei dividindo por $\\sqrt5$.",
          ],
        },
      ],
      cards: [
        {
          id: "ch09-hp-c1",
          q: "Como um hiperplano classifica e o que significa $|f(x)|$ grande?",
          a: r`Pelo sinal de $f(x)=\beta_0+\sum\beta_jx_j$. $|f(x)|$ grande: o ponto está longe do hiperplano, classificação mais confiável.`,
        },
        {
          id: "ch09-hp-c2",
          q: "O que é o classificador de margem máxima e o que são vetores de suporte?",
          a: "O hiperplano separador de maior margem (maior distância mínima aos pontos). Vetores de suporte: observações sobre a margem, as únicas que determinam o hiperplano.",
        },
      ],
    },

    {
      id: "ch09-svc",
      title: "O classificador de vetores de suporte (margem suave)",
      minutes: 14,
      book: "Seção 9.2, pp. 373–377",
      hook: "Quando as classes se misturam, permitimos errar, mas com um orçamento.",
      blocks: [
        {
          kind: "key",
          title: "Folgas e o orçamento C",
          body: r`<p>Introduzimos <b>folgas</b> $\varepsilon_i\ge0$:</p>$$y_i f(x_i)\ge M(1-\varepsilon_i),\qquad \sum_{i=1}^n\varepsilon_i\le C.$$<p>$\varepsilon_i=0$: ponto no lado certo da margem. $0<\varepsilon_i\le1$: <b>viola a margem</b> mas está do lado certo do hiperplano. $\varepsilon_i>1$: do <b>lado errado do hiperplano</b> (mal classificado). $C$ limita a soma das violações toleradas.</p>`,
        },
        {
          kind: "key",
          title: "C e o dilema viés-variância",
          body: r`<p>$C$ pequeno: pouca tolerância, margem estreita, ajuste fino aos dados (<b>viés baixo, variância alta</b>). $C$ grande: mais tolerância, margem larga, muitos vetores de suporte (<b>viés maior, variância menor</b>). $C$ se escolhe por validação cruzada.</p>`,
        },
        {
          kind: "warn",
          title: "Atenção ao código",
          body: r`<p>Bibliotecas podem definir o parâmetro de custo com o papel <b>inverso</b> do orçamento $C$ da teoria (custo maior = menos tolerância). Confira a documentação e o laboratório do livro (pp. 387–390) antes de interpretar “C grande”.</p>`,
        },
        {
          kind: "text",
          title: "Quem decide a fronteira",
          body: r`<p>Só as observações <b>sobre a margem ou do lado errado dela</b> (os vetores de suporte) influenciam o hiperplano. Pontos corretos e longe da margem são irrelevantes para o ajuste, o que torna o método robusto a eles.</p>`,
        },
      ],
      paper: [
        {
          id: "ch09-svc-p1",
          prompt: r`<p>Cinco observações têm folgas $\varepsilon=(0;\ 0;\ 0{,}4;\ 1{,}3;\ 0)$. (a) Descreva onde está cada uma. (b) Qual o gasto total do orçamento? Seria viável com $C=1$? E com $C=2$? (c) Quais observações são vetores de suporte?</p>`,
          hints: [
            r`Compare cada $\varepsilon_i$ com 0 e com 1. Os vetores de suporte têm $\varepsilon_i\ge0$ e estão na margem ou a violam.`,
          ],
          solution: r`<p>(a) 1, 2 e 5 ($\varepsilon=0$): do lado certo da margem (ou sobre ela). 3 ($0{,}4$): viola a margem mas está do lado certo do hiperplano. 4 ($1{,}3>1$): do lado errado do hiperplano (mal classificada).<br>(b) $\sum\varepsilon_i=1{,}7$: inviável com $C=1$, viável com $C=2$.<br>(c) As observações 3 e 4 certamente; também as de $\varepsilon=0$ que estiverem exatamente <i>sobre</i> a margem, o que os dados desta questão não permitem saber.</p>`,
          rubric: [
            "Interpretei 0, 0,4 e 1,3 corretamente.",
            "Soma 1,7: inviável com $C=1$, viável com $C=2$.",
            "Identifiquei 3 e 4 como vetores de suporte e notei a ambiguidade dos $\\varepsilon=0$.",
          ],
        },
      ],
      cards: [
        {
          id: "ch09-svc-c1",
          q: r`Interprete $\varepsilon_i=0$, $0<\varepsilon_i\le1$ e $\varepsilon_i>1$.`,
          a: "0: lado certo da margem. Entre 0 e 1: viola a margem, mas lado certo do hiperplano. Maior que 1: lado errado do hiperplano (mal classificado).",
        },
        {
          id: "ch09-svc-c2",
          q: "Como $C$ controla viés e variância no classificador de vetores de suporte?",
          a: "C pequeno: pouca tolerância, margem estreita, viés baixo e variância alta. C grande: mais tolerância, margem larga, viés maior e variância menor.",
        },
      ],
      deepDive: r`A Figura 9.7 (p. 377) mostra a margem alargando conforme o orçamento sobe, e a Figura 9.6 (p. 375) distingue as observações por posição. A Seção 9.2.2 traz a formulação completa.`,
    },

    {
      id: "ch09-svm",
      title: "Kernels e a máquina de vetores de suporte",
      minutes: 16,
      book: "Seções 9.3–9.5, pp. 377–386",
      hook: "Quando a fronteira é curva, ampliamos o espaço sem pagar o custo de calculá-lo.",
      blocks: [
        {
          kind: "key",
          title: "A ideia dos kernels",
          body: r`<p>Para fronteiras não lineares, poderíamos ampliar o espaço com $X_j^2$, $X_jX_k$ etc., mas isso explode. A solução do SVM depende dos dados <b>apenas por produtos internos</b>, então podemos trocá-los por uma <b>função kernel</b> $K(x_i,x_{i'})$, que mede a semelhança entre dois pontos. O classificador fica</p>$$f(x)=\beta_0+\sum_{i\in\mathcal S}\alpha_iK(x,x_i),$$<p>com $\mathcal S$ o conjunto dos vetores de suporte.</p>`,
        },
        {
          kind: "text",
          title: "Dois kernels comuns",
          body: r`<p><b>Polinomial</b> de grau $d$: $K(x,x')=\big(1+\sum_jx_jx'_j\big)^d$. <b>Radial</b>: $K(x,x')=\exp\big(-\gamma\sum_j(x_j-x'_j)^2\big)$, com $\gamma>0$. No radial, pontos <b>distantes</b> quase não influenciam a previsão em $x$: o comportamento é <b>local</b>, e $\gamma$ grande dá fronteiras mais irregulares (mais flexíveis).</p>`,
        },
        {
          kind: "text",
          title: "Mais de duas classes",
          body: r`<p><b>Um contra um</b>: treina $\binom K2$ classificadores (um por par) e vota. <b>Um contra todos</b>: treina $K$ classificadores (cada classe contra as demais) e escolhe a classe com maior $f_k(x)$.</p>`,
        },
        {
          kind: "text",
          title: "Relação com regressão logística",
          body: r`<p>O SVM pode ser escrito como “perda + penalidade”: minimiza $\sum\max\big(0,1-y_if(x_i)\big)+\lambda\sum\beta_j^2$. Essa <b>perda hinge</b> é zero para pontos corretos além da margem, e é parecida com a perda logística, o que explica por que SVM e logística dão resultados semelhantes quando as classes são bem separáveis.</p>`,
        },
      ],
      paper: [
        {
          id: "ch09-svm-p1",
          prompt: r`<p>(a) Kernel radial com $\gamma=0{,}5$: calcule $K(x,x')$ para $x=(0,0)$, $x'=(1,1)$ e para $x'=(3,3)$. (b) Kernel polinomial de grau 2 para $x=(1,2)$, $x'=(3,1)$. (c) Com $K=5$ classes, quantos classificadores têm “um contra um” e “um contra todos”?</p>`,
          hints: [r`Radial: $\exp(-\gamma\|x-x'\|^2)$. Polinomial: $(1+x\cdot x')^2$.`],
          solution: r`<p>(a) $\|x-x'\|^2=2$: $e^{-0{,}5\cdot2}=e^{-1}\approx0{,}368$. Para $(3,3)$: $\|\cdot\|^2=18$, $e^{-9}\approx0{,}00012$: praticamente zero. Pontos distantes não influenciam (comportamento local).<br>(b) $x\cdot x'=3+2=5$, $(1+5)^2=36$.<br>(c) Um contra um: $\binom52=10$. Um contra todos: $5$.</p>`,
          rubric: [
            "Radial: 0,368 e $\\approx0{,}0001$.",
            "Polinomial: 36.",
            "10 e 5 classificadores.",
          ],
        },
      ],
      spot: {
        intro: r`<p>Davi explica o SVM com kernel radial. <b>Qual passo está errado?</b></p>`,
        steps: [
          "A solução depende dos dados só por produtos internos, trocados por um kernel $K$.",
          "No kernel radial, pontos de treino distantes de $x$ têm influência pequena sobre $f(x)$.",
          "Por isso o kernel radial dá um comportamento local.",
          r`Aumentar $\gamma$ suaviza a fronteira e reduz a flexibilidade.`,
        ],
        wrong: 3,
        why: r`Com $\gamma$ maior, $\exp(-\gamma\|x-x'\|^2)$ cai mais rápido com a distância: só vizinhos muito próximos contam, e a fronteira fica <b>mais irregular e flexível</b>, não mais suave.`,
      },
      cards: [
        {
          id: "ch09-svm-c1",
          q: "Por que o truque do kernel é útil?",
          a: "A solução depende dos dados só por produtos internos. Trocá-los por $K(x,x')$ permite fronteiras não lineares sem calcular explicitamente o espaço ampliado.",
        },
        {
          id: "ch09-svm-c2",
          q: "Kernels polinomial e radial: fórmulas e comportamento.",
          a: r`Polinomial: $(1+\sum x_jx'_j)^d$. Radial: $\exp(-\gamma\sum(x_j-x'_j)^2)$, com comportamento local; $\gamma$ maior, fronteira mais flexível.`,
        },
        {
          id: "ch09-svm-c3",
          q: "Como estender o SVM a mais de 2 classes?",
          a: r`Um contra um ($\binom K2$ classificadores, voto) ou um contra todos ($K$ classificadores, maior $f_k(x)$).`,
        },
      ],
      deepDive: r`A Seção 9.5 (p. 384) mostra a perda hinge ao lado da logística, e a Seção 9.3.3 (p. 382) aplica o SVM aos dados de doença cardíaca com curvas ROC. O laboratório está nas pp. 387–394.`,
    },
  ],
};
export default ch;

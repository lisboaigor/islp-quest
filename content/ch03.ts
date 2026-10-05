import type { Chapter } from "@/lib/types";
const r = String.raw;

const ch: Chapter = {
  id: "ch03",
  num: 3,
  title: "Regressão linear",
  pages: "pp. 69–134",
  blurb:
    "Mínimos quadrados, incerteza dos coeficientes, regressão múltipla, interações e o que pode dar errado.",
  lessons: [
    {
      id: "ch03-minimos-quadrados",
      title: "Mínimos quadrados: a reta que erra menos",
      minutes: 12,
      book: "Seção 3.1.1, pp. 71–72",
      hook: "Entre infinitas retas possíveis, qual escolher? O livro responde com uma soma de quadrados.",
      predict: {
        q: "Por que a soma dos resíduos $\\sum e_i$ não serve como critério para escolher a reta?",
        options: [
          "Porque é difícil de calcular",
          "Porque erros positivos e negativos se cancelam",
          "Porque sempre dá zero em qualquer reta",
        ],
        answer: 1,
        why: r`Erros de sinais opostos se cancelam: uma reta péssima pode ter soma de resíduos zero. Elevar ao quadrado impede o cancelamento e pune mais os erros grandes.`,
      },
      blocks: [
        {
          kind: "text",
          title: "O modelo",
          body: r`<p>Regressão linear simples prevê $Y$ a partir de um único $X$, supondo uma relação linear:</p>$$Y=\beta_0+\beta_1X+\varepsilon.$$<p>$\beta_0$ é o intercepto e $\beta_1$ a inclinação. Ambos são desconhecidos e estimados com $n$ pares $(x_i,y_i)$. No livro: vendas versus orçamento de TV, $n=200$ mercados.</p>`,
        },
        {
          kind: "key",
          title: "O critério",
          body: r`<p>Com $\hat y_i=\hat\beta_0+\hat\beta_1x_i$, o <b>resíduo</b> é $e_i=y_i-\hat y_i$. A <b>soma dos quadrados dos resíduos</b> é</p>$$\text{RSS}=e_1^2+e_2^2+\dots+e_n^2.$$<p>Mínimos quadrados escolhe $\hat\beta_0,\hat\beta_1$ que <b>minimizam o RSS</b>.</p>`,
        },
        {
          kind: "key",
          title: "A solução",
          body: r`$$\hat\beta_1=\frac{\sum_{i=1}^n(x_i-\bar x)(y_i-\bar y)}{\sum_{i=1}^n(x_i-\bar x)^2},\qquad \hat\beta_0=\bar y-\hat\beta_1\bar x.$$<p>A segunda equação diz que a reta passa sempre pelo ponto das médias $(\bar x,\bar y)$.</p>`,
          margin:
            "Nos dados Advertising o livro obtém $\\hat\\beta_0=7{,}03$ e $\\hat\\beta_1=0{,}0475$.",
        },
        {
          kind: "text",
          title: "Lendo o resultado",
          body: r`<p>No exemplo, $X$ é o orçamento de TV em <b>milhares de dólares</b> e $Y$ as vendas em <b>milhares de unidades</b>. Então $\hat\beta_1=0{,}0475$ quer dizer: mais mil dólares em TV está associado a cerca de $0{,}0475\times1000=47{,}5$ unidades a mais vendidas.</p>`,
        },
        {
          kind: "warn",
          title: "Cuidado",
          body: r`<p>Sempre leia o coeficiente <b>com as unidades</b>. Dizer “$\hat\beta_1=0{,}0475$” sem dizer em que escala $X$ e $Y$ estão é uma interpretação vazia.</p>`,
        },
      ],
      paper: [
        {
          id: "ch03-mq-p1",
          prompt: r`<p>Dados: $x=(1,2,3,4)$ e $y=(2,3,5,6)$. No caderno:</p><p>(a) Calcule $\bar x$, $\bar y$, $\sum(x_i-\bar x)(y_i-\bar y)$ e $\sum(x_i-\bar x)^2$.<br>(b) Obtenha $\hat\beta_1$ e $\hat\beta_0$.<br>(c) Calcule os quatro resíduos e o RSS.</p>`,
          hints: [
            r`$\bar x=2{,}5$, $\bar y=4$. Faça uma tabela com $x_i-\bar x$ e $y_i-\bar y$.`,
            r`Os produtos são $3;\ 0{,}5;\ 0{,}5;\ 3$. Os quadrados de $x_i-\bar x$ são $2{,}25;\ 0{,}25;\ 0{,}25;\ 2{,}25$.`,
          ],
          solution: r`<p>(a) $\bar x=2{,}5$, $\bar y=4$. Produtos: $(-1{,}5)(-2)=3$; $(-0{,}5)(-1)=0{,}5$; $(0{,}5)(1)=0{,}5$; $(1{,}5)(2)=3$. Soma $=7$. Quadrados em $x$: $2{,}25+0{,}25+0{,}25+2{,}25=5$.</p><p>(b) $\hat\beta_1=7/5=1{,}4$; $\hat\beta_0=4-1{,}4\cdot2{,}5=0{,}5$. Reta: $\hat y=0{,}5+1{,}4x$.</p><p>(c) $\hat y=(1{,}9;\ 3{,}3;\ 4{,}7;\ 6{,}1)$. Resíduos: $(0{,}1;\ -0{,}3;\ 0{,}3;\ -0{,}1)$. $\text{RSS}=0{,}01+0{,}09+0{,}09+0{,}01=0{,}20$.</p>`,
          rubric: [
            "Médias $\\bar x=2{,}5$ e $\\bar y=4$.",
            "Somas: 7 (produtos) e 5 (quadrados).",
            "$\\hat\\beta_1=1{,}4$ e $\\hat\\beta_0=0{,}5$.",
            "Resíduos corretos e RSS = 0,20.",
          ],
        },
        {
          id: "ch03-mq-p2",
          prompt: r`<p>Mostre no caderno, usando $\hat\beta_0=\bar y-\hat\beta_1\bar x$, que a reta de mínimos quadrados passa por $(\bar x,\bar y)$. Depois confira com os números da questão anterior.</p>`,
          hints: [r`Calcule $\hat y$ em $x=\bar x$ e substitua $\hat\beta_0$.`],
          solution: r`<p>$\hat y(\bar x)=\hat\beta_0+\hat\beta_1\bar x=(\bar y-\hat\beta_1\bar x)+\hat\beta_1\bar x=\bar y$. ∎</p><p>Conferindo: $\hat y(2{,}5)=0{,}5+1{,}4\cdot2{,}5=4=\bar y$.</p>`,
          rubric: [
            r`Substituí $\hat\beta_0$ e os termos $\hat\beta_1\bar x$ se cancelaram.`,
            "Conferi numericamente: $\\hat y(2{,}5)=4$.",
          ],
        },
      ],
      spot: {
        intro: r`<p>Um analista lê a saída do livro ($\hat\beta_1=0{,}0475$, TV em milhares de dólares, vendas em milhares de unidades). <b>Qual passo está errado?</b></p>`,
        steps: [
          r`$\hat\beta_1=0{,}0475$ é a inclinação estimada da reta.`,
          "TV está em milhares de dólares e vendas em milhares de unidades.",
          "Logo, gastar um dólar a mais em TV vende 0,0475 unidades a mais.",
          "Portanto, mil dólares a mais em TV estão associados a cerca de 47,5 unidades a mais.",
        ],
        wrong: 2,
        why: r`A unidade de $X$ é “mil dólares”, então $0{,}0475$ é por <b>mil dólares</b>, e o resultado está em <b>milhares de unidades</b>: $0{,}0475\times1000=47{,}5$ unidades. Misturar escalas dá uma conclusão errada por um fator 1000.`,
      },
      cards: [
        {
          id: "ch03-mq-c1",
          q: "Defina RSS e diga o que mínimos quadrados minimiza.",
          a: r`$\text{RSS}=\sum e_i^2=\sum(y_i-\hat y_i)^2$. Mínimos quadrados escolhe $\hat\beta_0,\hat\beta_1$ que minimizam o RSS.`,
        },
        {
          id: "ch03-mq-c2",
          q: r`Fórmulas de $\hat\beta_1$ e $\hat\beta_0$ na regressão simples.`,
          a: r`$\hat\beta_1=\dfrac{\sum(x_i-\bar x)(y_i-\bar y)}{\sum(x_i-\bar x)^2}$, $\hat\beta_0=\bar y-\hat\beta_1\bar x$.`,
        },
        {
          id: "ch03-mq-c3",
          q: "Por onde passa sempre a reta de mínimos quadrados?",
          a: r`Pelo ponto das médias $(\bar x,\bar y)$.`,
        },
      ],
      deepDive: r`A Figura 3.2 (p. 73) mostra a superfície do RSS em função de $(\beta_0,\beta_1)$ para os dados Advertising, com o mínimo marcado. É a imagem de “otimizar” em vez de só aplicar a fórmula.`,
    },

    {
      id: "ch03-incerteza",
      title: "Incerteza dos coeficientes: erro-padrão, intervalo e teste t",
      minutes: 14,
      book: "Seção 3.1.2, pp. 72–77",
      hook: "Se você sorteasse outra amostra, a reta seria outra. Quanto outra?",
      blocks: [
        {
          kind: "text",
          title: "A reta verdadeira e a estimada",
          body: r`<p>A relação verdadeira da população, $Y=\beta_0+\beta_1X+\varepsilon$, é a <b>reta da população</b>. A reta de mínimos quadrados é uma <b>estimativa</b> feita com uma amostra. Outra amostra daria outra reta, e a média de muitas dessas retas se aproxima da verdadeira: o estimador é <b>não viesado</b>.</p>`,
        },
        {
          kind: "key",
          title: "Erro-padrão",
          body: r`<p>Quanto $\hat\beta_1$ varia de amostra para amostra:</p>$$\text{SE}(\hat\beta_1)^2=\frac{\sigma^2}{\sum(x_i-\bar x)^2},\qquad \sigma^2=\operatorname{Var}(\varepsilon).$$<p>É menor quando os $x_i$ são mais espalhados (mais “alavanca”). Como $\sigma^2$ é desconhecido, estimamos por $\text{RSE}=\sqrt{\text{RSS}/(n-2)}$.</p>`,
        },
        {
          kind: "key",
          title: "Intervalo de confiança e teste",
          body: r`<p>Um intervalo de confiança de 95% para $\beta_1$ é, aproximadamente, $\hat\beta_1\pm2\cdot\text{SE}(\hat\beta_1)$. Para testar $H_0:\beta_1=0$ (não há relação) usamos</p>$$t=\frac{\hat\beta_1-0}{\text{SE}(\hat\beta_1)}.$$<p>O <b>p-valor</b> é a probabilidade de observar um $|t|$ tão grande ou maior se $H_0$ fosse verdadeira. p-valor pequeno: rejeitamos $H_0$ e concluímos que há relação.</p>`,
          margin:
            "No livro (Tabela 3.1): TV tem $\\hat\\beta_1=0{,}0475$, SE $=0{,}0027$, $t=17{,}67$, p $<0{,}0001$.",
        },
        {
          kind: "warn",
          title: "Cuidado",
          body: r`<p>O p-valor <b>não</b> é a probabilidade de $H_0$ ser verdadeira. É a probabilidade dos dados (ou algo mais extremo) <i>supondo</i> $H_0$. E a regra “$\pm2$ erros-padrão” vale para $n$ grande; com amostras pequenas usa-se a distribuição $t$.</p>`,
        },
      ],
      paper: [
        {
          id: "ch03-inc-p1",
          prompt: r`<p>Use os dados da lição anterior ($x=(1,2,3,4)$, $y=(2,3,5,6)$, $\hat\beta_1=1{,}4$, $\text{RSS}=0{,}20$).</p><p>(a) Calcule $\text{RSE}=\sqrt{\text{RSS}/(n-2)}$.<br>(b) Calcule $\text{SE}(\hat\beta_1)$.<br>(c) Calcule $t=\hat\beta_1/\text{SE}(\hat\beta_1)$ e interprete.</p>`,
          hints: [
            r`$n-2=2$, então $\text{RSE}^2=0{,}20/2=0{,}10$.`,
            r`$\sum(x_i-\bar x)^2=5$ (da lição anterior). $\text{SE}^2=\text{RSE}^2/5$.`,
          ],
          solution: r`<p>(a) $\text{RSE}=\sqrt{0{,}2/2}=\sqrt{0{,}1}\approx0{,}316$.<br>(b) $\text{SE}(\hat\beta_1)=\sqrt{0{,}1/5}=\sqrt{0{,}02}\approx0{,}141$.<br>(c) $t=1{,}4/0{,}141\approx9{,}9$. A inclinação está a quase 10 erros-padrão de zero: forte evidência de relação (com $n=4$ valeria conferir na tabela da distribuição $t$ com 2 graus de liberdade, mas a conclusão é a mesma).</p>`,
          rubric: [
            "RSE ≈ 0,316.",
            "SE($\\hat\\beta_1$) ≈ 0,141.",
            "$t\\approx9{,}9$ e concluí que há relação.",
          ],
        },
        {
          id: "ch03-inc-p2",
          prompt: r`<p>Com a Tabela 3.1 do livro: $\hat\beta_1=0{,}0475$ e $\text{SE}(\hat\beta_1)=0{,}0027$ para TV.</p><p>(a) Calcule o intervalo de confiança de 95% aproximado. (b) Calcule $t$. (c) Explique em uma frase o que um p-valor $<0{,}0001$ quer dizer.</p>`,
          hints: [r`IC: $\hat\beta_1\pm2\cdot\text{SE}$.`],
          solution: r`<p>(a) $0{,}0475\pm2(0{,}0027)=[0{,}0421;\ 0{,}0529]$.<br>(b) $t=0{,}0475/0{,}0027\approx17{,}6$ (o livro dá 17,67 por arredondamento).<br>(c) Se de fato não houvesse relação entre TV e vendas, seria quase impossível observar um $t$ tão grande.</p>`,
          rubric: [
            "IC ≈ [0,042; 0,053].",
            "t ≈ 17,6.",
            "Expliquei o p-valor como probabilidade dos dados sob $H_0$, não de $H_0$.",
          ],
        },
      ],
      cards: [
        {
          id: "ch03-inc-c1",
          q: "O que mede $\\text{SE}(\\hat\\beta_1)$ e quando é menor?",
          a: r`Quanto $\hat\beta_1$ varia entre amostras. É menor quando os $x_i$ são mais espalhados e quando $\sigma^2$ é menor.`,
        },
        {
          id: "ch03-inc-c2",
          q: "Fórmula do IC aproximado de 95% e da estatística $t$.",
          a: r`IC: $\hat\beta_1\pm2\,\text{SE}(\hat\beta_1)$. $t=\hat\beta_1/\text{SE}(\hat\beta_1)$ testa $H_0:\beta_1=0$.`,
        },
        {
          id: "ch03-inc-c3",
          q: "O que é um p-valor?",
          a: r`A probabilidade de observar uma estatística tão extrema quanto a observada (ou mais) se $H_0$ for verdadeira. Não é a probabilidade de $H_0$ ser verdadeira.`,
        },
      ],
      deepDive: r`A discussão sobre por que $\sigma^2$ é estimado por RSE e o detalhe de $n-2$ graus de liberdade estão em torno da equação (3.8), p. 75. O texto também explica por que o estimador de mínimos quadrados é “não viesado” com a analogia da média amostral.`,
    },

    {
      id: "ch03-ajuste",
      title: "Qualidade do ajuste: RSE e R²",
      minutes: 10,
      book: "Seção 3.1.3, pp. 77–80",
      hook: "O coeficiente é significativo. Mas o modelo é bom?",
      blocks: [
        {
          kind: "key",
          title: "RSE: o erro típico, na unidade de Y",
          body: r`$$\text{RSE}=\sqrt{\frac{1}{n-2}\text{RSS}}$$<p>Estima o desvio-padrão de $\varepsilon$: quanto a resposta se afasta, em média, da reta verdadeira. No livro, RSE $=3{,}26$: as vendas reais diferem da reta em cerca de 3.260 unidades. Como a média de vendas é cerca de 14.000, isso é um erro de uns $23\%$.</p>`,
          margin:
            "Se o RSE é grande ou pequeno depende da escala de $Y$ e do problema. Por isso o R² ajuda.",
        },
        {
          kind: "key",
          title: "R²: a proporção explicada",
          body: r`$$R^2=\frac{\text{TSS}-\text{RSS}}{\text{TSS}}=1-\frac{\text{RSS}}{\text{TSS}},\qquad \text{TSS}=\sum(y_i-\bar y)^2.$$<p>TSS é a variabilidade total de $Y$ antes da regressão. $R^2$ é a fração dessa variabilidade que o modelo remove. Fica sempre entre 0 e 1. Nos dados do livro, $R^2=0{,}612$: pouco menos de dois terços da variabilidade das vendas é explicada por TV.</p>`,
        },
        {
          kind: "text",
          title: "Ligação com a correlação",
          body: r`<p>Na regressão simples, $R^2=r^2$, o quadrado da correlação entre $X$ e $Y$. Na regressão múltipla, essa relação deixa de valer, e o $R^2$ passa a fazer o papel de medida geral.</p>`,
        },
        {
          kind: "warn",
          title: "Cuidado",
          body: r`<p>Não existe um “bom R²” universal. Num problema de física com relação quase linear, $R^2$ perto de 1 é esperado. Em biologia ou marketing, com muito ruído, $R^2$ de 0,1 já pode ser realista.</p>`,
        },
      ],
      paper: [
        {
          id: "ch03-aj-p1",
          prompt: r`<p>Com os mesmos dados ($y=(2,3,5,6)$, $\text{RSS}=0{,}20$): (a) calcule o TSS; (b) calcule $R^2$; (c) confira que $R^2=r^2$ calculando a correlação $r=\dfrac{\sum(x_i-\bar x)(y_i-\bar y)}{\sqrt{\sum(x_i-\bar x)^2}\sqrt{\sum(y_i-\bar y)^2}}$.</p>`,
          hints: [
            r`$\bar y=4$, então $y_i-\bar y=(-2,-1,1,2)$.`,
            r`Da lição 1: $\sum(x_i-\bar x)(y_i-\bar y)=7$ e $\sum(x_i-\bar x)^2=5$.`,
          ],
          solution: r`<p>(a) $\text{TSS}=4+1+1+4=10$.<br>(b) $R^2=1-0{,}2/10=0{,}98$.<br>(c) $r=\dfrac{7}{\sqrt5\sqrt{10}}=\dfrac{7}{\sqrt{50}}\approx0{,}9899$; $r^2=\dfrac{49}{50}=0{,}98$. ✓</p>`,
          rubric: ["TSS = 10.", "$R^2=0{,}98$.", "$r^2=49/50=0{,}98$, igual ao $R^2$."],
        },
        {
          id: "ch03-aj-p2",
          prompt: r`<p>Um modelo tem $\text{TSS}=100$ e $\text{RSS}=39$. (a) Qual é o $R^2$? (b) Em palavras, o que significa? (c) O que acontece com RSE, $R^2$ e a reta se todos os $y_i$ forem multiplicados por 1000?</p>`,
          hints: [r`(c) RSE tem a unidade de $Y$; $R^2$ é uma razão.`],
          solution: r`<p>(a) $R^2=1-39/100=0{,}61$.<br>(b) O modelo explica 61% da variabilidade de $Y$.<br>(c) O RSE e os coeficientes ficam multiplicados por 1000 (mudou a unidade). O $R^2$ <b>não muda</b>, pois é uma proporção, sem unidade.</p>`,
          rubric: [
            "$R^2=0{,}61$.",
            "Interpretei como proporção da variabilidade explicada.",
            "Entendi que o RSE depende da escala e o $R^2$ não.",
          ],
        },
      ],
      spot: {
        intro: r`<p>Camila lê a Tabela 3.2 do livro ($R^2=0{,}612$). <b>Qual passo está errado?</b></p>`,
        steps: [
          r`$R^2=1-\text{RSS}/\text{TSS}$.`,
          "Logo $R^2=0{,}612$ diz que 61,2% da variabilidade de $Y$ é explicada pelo modelo.",
          "Portanto o modelo acerta 61,2% das previsões.",
          "Valores mais altos de $R^2$ indicam um ajuste mais próximo dos dados de treino.",
        ],
        wrong: 2,
        why: r`$R^2$ é a proporção da <b>variância</b> explicada, não uma taxa de acertos. Em regressão a previsão nunca “acerta” exatamente; o que existe é o tamanho do erro (RSE).`,
      },
      cards: [
        {
          id: "ch03-aj-c1",
          q: "O que o RSE mede e em que unidade está?",
          a: r`Estima o desvio-padrão de $\varepsilon$: o quanto a resposta se afasta da reta em média. Está na unidade de $Y$.`,
        },
        {
          id: "ch03-aj-c2",
          q: "Fórmula e interpretação do R².",
          a: r`$R^2=1-\text{RSS}/\text{TSS}$: proporção da variabilidade de $Y$ explicada pelo modelo. Fica entre 0 e 1.`,
        },
        {
          id: "ch03-aj-c3",
          q: "Que relação há entre $R^2$ e correlação na regressão simples?",
          a: r`$R^2=r^2$.`,
        },
      ],
    },

    {
      id: "ch03-multipla",
      title: "Regressão múltipla e o paradoxo do jornal",
      minutes: 14,
      book: "Seções 3.2.1–3.2.2 (início), pp. 80–85",
      hook: "O jornal parece vender, até você controlar pelo rádio.",
      predict: {
        q: "No livro, a regressão simples de vendas sobre jornal mostra associação positiva. Na regressão múltipla (TV, rádio, jornal), o coeficiente de jornal é…",
        options: [
          "Ainda positivo e significativo",
          "Próximo de zero e não significativo",
          "Fortemente negativo",
        ],
        answer: 1,
        why: r`O coeficiente de jornal fica em $-0{,}001$, com p-valor $0{,}86$ (Tabela 3.4). A associação simples vinha da correlação entre jornal e rádio.`,
      },
      blocks: [
        {
          kind: "text",
          title: "O modelo múltiplo",
          body: r`<p>Com $p$ preditores:</p>$$Y=\beta_0+\beta_1X_1+\dots+\beta_pX_p+\varepsilon.$$<p>Cada $\beta_j$ é o efeito médio em $Y$ de aumentar $X_j$ em uma unidade, <b>mantendo os demais preditores fixos</b>. Os coeficientes também minimizam o RSS.</p>`,
        },
        {
          kind: "key",
          title: "O paradoxo",
          body: r`<p>Tabela 3.4 do livro (regressão múltipla):</p><p>Intercepto $2{,}939$ · TV $0{,}046$ ($p<0{,}0001$) · rádio $0{,}189$ ($p<0{,}0001$) · jornal $-0{,}001$ ($p=0{,}86$).</p><p>Sozinho, o jornal parecia relacionado às vendas. Com os outros no modelo, não.</p>`,
          margin:
            "Correlações (Tabela 3.5): rádio–jornal $=0{,}35$; vendas–jornal $=0{,}23$; vendas–rádio $=0{,}58$.",
        },
        {
          kind: "analogy",
          title: "A explicação",
          body: r`<p>Mercados que gastam muito com jornal tendem a gastar também com rádio (correlação 0,35). Na regressão simples, o jornal “empresta” o efeito do rádio. Ao incluir rádio no modelo, o efeito do jornal some. É como notar que o consumo de sorvete está associado a afogamentos: os dois dependem do calor.</p>`,
        },
        {
          kind: "warn",
          title: "Cuidado",
          body: r`<p>Regressão simples e múltipla podem dar conclusões <b>opostas</b> sobre o mesmo preditor. Isso não é um erro: respondem perguntas diferentes (“associação isolada” e “associação mantendo os outros fixos”). E correlação aqui não prova causa.</p>`,
        },
      ],
      paper: [
        {
          id: "ch03-mult-p1",
          prompt: r`<p>Use a Tabela 3.4: $\hat y=2{,}939+0{,}046\,\text{TV}+0{,}189\,\text{radio}-0{,}001\,\text{jornal}$ (orçamentos em milhares de dólares, vendas em milhares de unidades).</p><p>(a) Preveja as vendas para TV $=100$, rádio $=20$, jornal $=30$.<br>(b) Quanto muda a previsão se o rádio sobe 10 (resto fixo)?<br>(c) E se o jornal sobe 10 (resto fixo)? Faz diferença prática?</p>`,
          hints: [r`(b) e (c) são só o coeficiente vezes a variação.`],
          solution: r`<p>(a) $2{,}939+0{,}046\cdot100+0{,}189\cdot20-0{,}001\cdot30=2{,}939+4{,}6+3{,}78-0{,}03=11{,}289$, isto é, cerca de 11.289 unidades.<br>(b) $+0{,}189\cdot10=1{,}89$ (milhares de unidades).<br>(c) $-0{,}001\cdot10=-0{,}01$: praticamente zero, coerente com um coeficiente indistinguível de zero.</p>`,
          rubric: [
            "(a) ≈ 11,289.",
            "(b) +1,89.",
            "(c) −0,01, e concluí que não faz diferença prática.",
          ],
        },
      ],
      cards: [
        {
          id: "ch03-mult-c1",
          q: r`Como interpretar $\beta_j$ na regressão múltipla?`,
          a: r`O efeito médio em $Y$ de aumentar $X_j$ em uma unidade, mantendo todos os outros preditores fixos.`,
        },
        {
          id: "ch03-mult-c2",
          q: "Por que o jornal some do modelo múltiplo nos dados Advertising?",
          a: "Jornal e rádio são correlacionados (0,35). Na regressão simples o jornal capta o efeito do rádio; com rádio no modelo, o coeficiente de jornal vai a cerca de zero.",
        },
      ],
    },

    {
      id: "ch03-perguntas",
      title: "Perguntas importantes: estatística F, seleção e previsão",
      minutes: 14,
      book: "Seção 3.2.2, pp. 83–91",
      hook: "Um preditor é significativo; cem preditores são um perigo.",
      blocks: [
        {
          kind: "key",
          title: "Pelo menos um preditor importa?",
          body: r`<p>Testamos $H_0:\beta_1=\dots=\beta_p=0$ com a <b>estatística F</b>:</p>$$F=\frac{(\text{TSS}-\text{RSS})/p}{\text{RSS}/(n-p-1)}.$$<p>Se $H_0$ é verdadeira, $F$ fica perto de 1. Se não, fica bem maior. No livro, $F=570$ nos dados Advertising: forte evidência de que ao menos uma mídia importa.</p>`,
        },
        {
          kind: "warn",
          title: "Por que não olhar só os p-valores individuais?",
          body: r`<p>Com $p=100$ preditores sem nenhuma relação com $Y$, cerca de 5% deles terão p-valor $<0{,}05$ só por acaso. Olhar o menor p-valor “encontra” relações que não existem. A estatística F corrige isso porque é um único teste para o conjunto.</p>`,
        },
        {
          kind: "text",
          title: "Quais preditores importam?",
          body: r`<p>Testar todos os subconjuntos é inviável ($2^p$ modelos). Alternativas clássicas: seleção <b>forward</b> (começa vazio e adiciona), <b>backward</b> (começa cheio e remove) e <b>mista</b>. Elas voltam com critérios melhores no Capítulo 6.</p>`,
        },
        {
          kind: "text",
          title: "Previsão: dois intervalos diferentes",
          body: r`<p>O <b>intervalo de confiança</b> estima a média de $Y$ para dados valores de $X$ (incerteza só nos coeficientes). O <b>intervalo de predição</b> prevê um valor individual de $Y$ e inclui também o erro irredutível $\varepsilon$, por isso é <b>sempre mais largo</b>.</p>`,
        },
      ],
      paper: [
        {
          id: "ch03-f-p1",
          prompt: r`<p>Na regressão múltipla do livro, $n=200$, $p=3$ e $R^2=0{,}897$.</p><p>(a) Mostre que $F=\dfrac{R^2/p}{(1-R^2)/(n-p-1)}$ a partir da definição com TSS e RSS.<br>(b) Calcule $F$ e compare com o 570 do livro.</p>`,
          hints: [
            r`Divida numerador e denominador por TSS. Lembre que $R^2=(\text{TSS}-\text{RSS})/\text{TSS}$.`,
            r`$n-p-1=196$ e $1-R^2=0{,}103$.`,
          ],
          solution: r`<p>(a) Dividindo por TSS: $\dfrac{(\text{TSS}-\text{RSS})/p}{\text{RSS}/(n-p-1)}=\dfrac{\big[(\text{TSS}-\text{RSS})/\text{TSS}\big]/p}{\big[\text{RSS}/\text{TSS}\big]/(n-p-1)}=\dfrac{R^2/p}{(1-R^2)/(n-p-1)}$.</p><p>(b) $F=\dfrac{0{,}897/3}{0{,}103/196}=\dfrac{0{,}299}{0{,}000526}\approx569$, praticamente o 570 do livro (a diferença é arredondamento de $R^2$).</p>`,
          rubric: [
            "Dividi por TSS e reconheci $R^2$ e $1-R^2$.",
            "Usei $n-p-1=196$.",
            "Obtive $F\\approx569$ e comparei com 570.",
          ],
        },
        {
          id: "ch03-f-p2",
          prompt: r`<p>Você testa $p=100$ preditores independentes, sem nenhuma relação com $Y$, cada um com nível 5%. (a) Quantos você espera que apareçam “significativos”? (b) Qual a probabilidade de <b>pelo menos um</b> aparecer significativo? (c) O que isso diz sobre usar só p-valores individuais?</p>`,
          hints: [r`(b) Complemento: nenhum significativo tem probabilidade $0{,}95^{100}$.`],
          solution: r`<p>(a) $100\times0{,}05=5$.<br>(b) $1-0{,}95^{100}\approx1-0{,}0059=0{,}994$: quase certo.<br>(c) Com muitos preditores, p-valores individuais produzem falsas descobertas. É preciso um teste global (F) ou métodos de seleção que levem isso em conta.</p>`,
          rubric: [
            "(a) 5.",
            "(b) ≈ 0,994, usando o complemento.",
            "Conclui que p-valores individuais isolados enganam com $p$ grande.",
          ],
        },
      ],
      cards: [
        {
          id: "ch03-f-c1",
          q: "Qual hipótese a estatística F testa e como é seu valor sob $H_0$?",
          a: r`$H_0:\beta_1=\dots=\beta_p=0$. Sob $H_0$, $F$ fica perto de 1; se algum $\beta_j\ne0$, $F$ tende a ser bem maior.`,
        },
        {
          id: "ch03-f-c2",
          q: "Por que usar a F e não só os p-valores individuais quando $p$ é grande?",
          a: "Mesmo sem nenhuma relação, cerca de 5% dos preditores terão p < 0,05 por acaso. A F é um único teste global.",
        },
        {
          id: "ch03-f-c3",
          q: "Diferença entre intervalo de confiança e de predição.",
          a: r`Confiança: média de $Y$ para dado $X$. Predição: um valor individual de $Y$; inclui o erro irredutível, então é sempre mais largo.`,
        },
      ],
      deepDive: r`Na p. 87 o livro discute por que $F$ e $t$ individuais concordam quando $p=1$ ($F=t^2$) e como a seleção forward/backward/mista funciona; na p. 90 há o exemplo numérico de intervalos de confiança e de predição (Advertising).`,
    },

    {
      id: "ch03-extensoes",
      title: "Variáveis qualitativas, interações e polinômios",
      minutes: 14,
      book: "Seções 3.3.1–3.3.2, pp. 91–100",
      hook: "Como encaixar uma categoria numa reta? E o que fazer quando um efeito depende de outro?",
      blocks: [
        {
          kind: "key",
          title: "Variáveis dummy",
          body: r`<p>Um fator com 2 níveis vira uma variável 0/1: $x_i=1$ se o grupo é A, $0$ caso contrário. O modelo $y_i=\beta_0+\beta_1x_i+\varepsilon_i$ dá:</p><p>• $\beta_0$: média do grupo de referência ($x=0$).<br>• $\beta_0+\beta_1$: média do outro grupo.<br>• $\beta_1$: a <b>diferença</b> entre os grupos.</p><p>Com $k$ níveis criamos $k-1$ dummies; o nível sem dummy é a referência.</p>`,
        },
        {
          kind: "key",
          title: "Interações: o efeito depende de outro preditor",
          body: r`<p>O modelo aditivo supõe que o efeito de TV não depende do rádio. Para relaxar isso:</p>$$Y=\beta_0+\beta_1X_1+\beta_2X_2+\beta_3X_1X_2+\varepsilon.$$<p>Agora o efeito de $X_1$ é $\beta_1+\beta_3X_2$: varia com $X_2$. No livro, incluir TV×rádio sobe o $R^2$ de $89{,}7\%$ para $96{,}8\%$: explica $(96{,}8-89{,}7)/(100-89{,}7)\approx69\%$ da variabilidade que o modelo aditivo deixava sobrar.</p>`,
          margin:
            "Princípio hierárquico: se a interação entra, mantenha os efeitos principais mesmo que seus p-valores sejam altos.",
        },
        {
          kind: "text",
          title: "Relações não lineares: polinômios",
          body: r`<p>Para curvas, adicione potências: $Y=\beta_0+\beta_1X+\beta_2X^2+\varepsilon$. Continua sendo um modelo <b>linear nos coeficientes</b>, então o mesmo mínimos quadrados serve. O livro mostra isso nos dados Auto (consumo versus potência).</p>`,
        },
        {
          kind: "warn",
          title: "Cuidado",
          body: r`<p>“Linear” em regressão linear se refere aos <b>coeficientes</b>, não à forma da curva em $X$. Um polinômio é linear para o método, mesmo desenhando uma parábola.</p>`,
        },
      ],
      paper: [
        {
          id: "ch03-ext-p1",
          prompt: r`<p>Um fator “região” tem três níveis: Leste, Oeste, Sul. As médias de saldo são Leste $=500$, Oeste $=520$, Sul $=530$. Com Leste como referência:</p><p>(a) Escreva o modelo com dummies. (b) Quais são $\beta_0,\beta_1,\beta_2$? (c) Qual a diferença prevista entre Sul e Oeste, em função dos $\beta$?</p>`,
          hints: [
            r`Duas dummies: $I(\text{Oeste})$ e $I(\text{Sul})$. A média de cada grupo é $\beta_0$ mais o coeficiente do grupo.`,
          ],
          solution: r`<p>(a) $y=\beta_0+\beta_1I(\text{Oeste})+\beta_2I(\text{Sul})+\varepsilon$.<br>(b) $\beta_0=500$ (Leste), $\beta_1=520-500=20$, $\beta_2=530-500=30$.<br>(c) Sul menos Oeste $=\beta_2-\beta_1=10$.</p>`,
          rubric: [
            "Usei 2 dummies para 3 níveis.",
            "$\\beta_0=500$, $\\beta_1=20$, $\\beta_2=30$.",
            "Sul − Oeste $=\\beta_2-\\beta_1=10$.",
          ],
        },
        {
          id: "ch03-ext-p2",
          prompt: r`<p>Modelo com interação: $\hat y=6+0{,}02\,X_1+0{,}03\,X_2+0{,}001\,X_1X_2$.</p><p>(a) Qual é o efeito de aumentar $X_1$ em 1 unidade quando $X_2=0$? E quando $X_2=20$? (b) Quanto vale a previsão em $X_1=100$, $X_2=20$? (c) Interprete em palavras o fato de os dois efeitos serem diferentes.</p>`,
          hints: [r`O efeito de $X_1$ é $\beta_1+\beta_3X_2$.`],
          solution: r`<p>(a) $X_2=0$: $0{,}02$. $X_2=20$: $0{,}02+0{,}001\cdot20=0{,}04$.<br>(b) $6+0{,}02\cdot100+0{,}03\cdot20+0{,}001\cdot100\cdot20=6+2+0{,}6+2=10{,}6$.<br>(c) O efeito de $X_1$ dobra quando $X_2$ passa de 0 a 20: os dois preditores se reforçam (sinergia), e um modelo aditivo não captaria isso.</p>`,
          rubric: [
            "(a) 0,02 e 0,04.",
            "(b) 10,6.",
            "Expliquei que o efeito de $X_1$ depende do nível de $X_2$.",
          ],
        },
      ],
      spot: {
        intro: r`<p>Um colega diz: “Regressão linear só serve para relações em linha reta, então não dá para modelar uma parábola.” <b>Onde ele erra?</b></p>`,
        steps: [
          r`O modelo $Y=\beta_0+\beta_1X+\beta_2X^2+\varepsilon$ descreve uma parábola em $X$.`,
          r`Defina $Z=X^2$. O modelo vira $Y=\beta_0+\beta_1X+\beta_2Z+\varepsilon$.`,
          "Esse modelo não é linear nos coeficientes, então mínimos quadrados não se aplica.",
          "Logo, a parábola pode ser ajustada com o mesmo método, usando $X$ e $Z$ como preditores.",
        ],
        wrong: 2,
        why: r`O modelo é <b>linear nos coeficientes</b> $\beta_0,\beta_1,\beta_2$. A não linearidade está só na transformação de $X$, e mínimos quadrados funciona normalmente.`,
      },
      cards: [
        {
          id: "ch03-ext-c1",
          q: r`Fator com $k$ níveis: quantas dummies e como interpretar $\beta_0$?`,
          a: r`$k-1$ dummies. $\beta_0$ é a média do nível de referência; cada coeficiente é a diferença desse nível para a referência.`,
        },
        {
          id: "ch03-ext-c2",
          q: "No modelo com interação $X_1X_2$, qual é o efeito de $X_1$?",
          a: r`$\beta_1+\beta_3X_2$: depende do valor de $X_2$.`,
        },
        {
          id: "ch03-ext-c3",
          q: "O que diz o princípio hierárquico?",
          a: "Se a interação está no modelo, mantenha os efeitos principais dos preditores envolvidos, mesmo que seus p-valores sejam altos.",
        },
      ],
    },

    {
      id: "ch03-problemas",
      title: "Seis problemas que podem estragar a regressão",
      minutes: 14,
      book: "Seção 3.3.3, pp. 100–109",
      hook: "O modelo roda e cospe números. Isso não quer dizer que está certo.",
      blocks: [
        {
          kind: "key",
          title: "A lista do livro",
          body: r`<p>1. <b>Não linearidade</b> da relação. 2. <b>Correlação</b> dos erros (comum em séries temporais). 3. <b>Variância não constante</b> dos erros (heterocedasticidade). 4. <b>Outliers</b>. 5. Pontos de <b>alta alavancagem</b>. 6. <b>Colinearidade</b>.</p><p>A ferramenta central de diagnóstico é o <b>gráfico de resíduos</b> contra os valores ajustados.</p>`,
        },
        {
          kind: "text",
          title: "Outlier versus alavancagem",
          body: r`<p>Um <b>outlier</b> tem $y_i$ muito longe do previsto. Um ponto de <b>alta alavancagem</b> tem $x_i$ incomum. A alavancagem na regressão simples é</p>$$h_i=\frac1n+\frac{(x_i-\bar x)^2}{\sum_{j}(x_j-\bar x)^2},$$<p>e a média de todas as $h_i$ é $(p+1)/n$. Um $h_i$ muito acima disso sinaliza alta alavancagem, e esses pontos podem puxar a reta.</p>`,
        },
        {
          kind: "text",
          title: "Colinearidade e VIF",
          body: r`<p>Quando dois preditores estão fortemente correlacionados, fica difícil separar seus efeitos: os erros-padrão aumentam e coeficientes ficam instáveis. O <b>fator de inflação da variância</b>:</p>$$\text{VIF}(\hat\beta_j)=\frac{1}{1-R^2_{X_j\mid X_{-j}}}.$$<p>O menor valor é 1. Como regra prática, VIF acima de 5 ou 10 indica colinearidade problemática.</p>`,
          margin: "$R^2_{X_j|X_{-j}}$ é o $R^2$ da regressão de $X_j$ nos demais preditores.",
        },
        {
          kind: "warn",
          title: "Cuidado",
          body: r`<p>Colinearidade pode existir entre <b>três ou mais</b> preditores sem que nenhum par tenha correlação alta. A matriz de correlação não basta; o VIF detecta a <b>multicolinearidade</b>.</p>`,
        },
      ],
      paper: [
        {
          id: "ch03-prob-p1",
          prompt: r`<p>Com $x=(1,2,3,4)$ e $n=4$: (a) calcule a alavancagem $h_i$ de cada ponto. (b) Some todas. (c) Compare com $(p+1)/n$ para $p=1$. (d) Qual ponto tem mais alavancagem e por quê?</p>`,
          hints: [r`$\sum(x_j-\bar x)^2=5$, $\bar x=2{,}5$.`],
          solution: r`<p>(a) $h=\tfrac14+\dfrac{(x-2{,}5)^2}{5}$: $x=1$: $0{,}25+0{,}45=0{,}70$; $x=2$: $0{,}25+0{,}05=0{,}30$; $x=3$: $0{,}30$; $x=4$: $0{,}70$.<br>(b) Soma $=2$.<br>(c) $(p+1)/n\cdot n=p+1=2$ ✓, média $0{,}5$.<br>(d) $x=1$ e $x=4$ ($0{,}70$): estão mais longe do centro $\bar x=2{,}5$.</p>`,
          rubric: [
            "Calculei 0,70; 0,30; 0,30; 0,70.",
            "A soma deu 2, igual a $p+1$.",
            "Identifiquei os extremos como alta alavancagem.",
          ],
        },
        {
          id: "ch03-prob-p2",
          prompt: r`<p>(a) Se regredir $X_j$ nos outros preditores dá $R^2=0{,}90$, qual o VIF? (b) E se der $R^2=0{,}80$? (c) Qual o VIF quando $X_j$ é totalmente não correlacionado com os outros? (d) Para cada situação, diga qual dos seis problemas é: (i) resíduos em forma de funil; (ii) resíduos em U; (iii) um ponto com $x$ isolado à direita.</p>`,
          hints: [r`$\text{VIF}=1/(1-R^2)$.`],
          solution: r`<p>(a) $1/0{,}10=10$.<br>(b) $1/0{,}20=5$.<br>(c) $R^2=0\Rightarrow\text{VIF}=1$.<br>(d) (i) variância não constante; (ii) não linearidade; (iii) alta alavancagem.</p>`,
          rubric: [
            "VIF = 10 e 5.",
            "VIF mínimo = 1 quando não há colinearidade.",
            "Associei funil, U e ponto isolado ao problema certo.",
          ],
        },
      ],
      cards: [
        {
          id: "ch03-prob-c1",
          q: "Cite os seis problemas potenciais do livro.",
          a: "Não linearidade, erros correlacionados, variância não constante, outliers, pontos de alta alavancagem e colinearidade.",
        },
        {
          id: "ch03-prob-c2",
          q: "Diferença entre outlier e ponto de alta alavancagem.",
          a: r`Outlier: $y_i$ incomum dado $x_i$. Alta alavancagem: $x_i$ incomum.`,
        },
        {
          id: "ch03-prob-c3",
          q: "Fórmula e regra prática do VIF.",
          a: r`$\text{VIF}=1/(1-R^2_{X_j|X_{-j}})$. Mínimo 1; acima de 5 ou 10 indica colinearidade problemática.`,
        },
      ],
      deepDive: r`As Figuras 3.9 a 3.14 (pp. 100–106) mostram cada problema nos gráficos de resíduos (o U, o funil, o outlier, o ponto de alavancagem e a colinearidade entre limite e avaliação de crédito). Vale ver os gráficos para reconhecê-los de relance.`,
    },

    {
      id: "ch03-knn",
      title: "Regressão linear versus KNN",
      minutes: 12,
      book: "Seção 3.5, pp. 111–116",
      hook: "Paramétrico contra não paramétrico, no mesmo ringue.",
      blocks: [
        {
          kind: "key",
          title: "KNN para regressão",
          body: r`<p>Dado $K$ e um ponto $x_0$, ache os $K$ vizinhos mais próximos ($\mathcal N_0$) e preveja a <b>média das respostas</b> deles:</p>$$\hat f(x_0)=\frac1K\sum_{x_i\in\mathcal N_0}y_i.$$<p>Mesma ideia do KNN de classificação do Capítulo 2, trocando “classe mais votada” por “média”.</p>`,
        },
        {
          kind: "text",
          title: "O jogo entre os dois",
          body: r`<p>Se a forma verdadeira é linear, a regressão linear vence, mesmo contra o melhor $K$: ela supõe a forma certa e estima menos parâmetros. Se é não linear, o KNN (que não supõe forma) pode vencer. $K$ pequeno: curva irregular, variância alta. $K$ grande: curva suave, viés alto.</p>`,
        },
        {
          kind: "warn",
          title: "A maldição da dimensionalidade",
          body: r`<p>Quando $p$ cresce, os pontos ficam muito espalhados no espaço: para qualquer $x_0$, os “vizinhos mais próximos” estão longe. O KNN piora rapidamente com $p$, enquanto a regressão linear sofre bem menos. Com poucas observações por preditor, o paramétrico costuma ser preferível.</p>`,
        },
      ],
      paper: [
        {
          id: "ch03-knn-p1",
          prompt: r`<p>Pontos $(x,y)$: $(1,2),(2,4),(3,5),(5,9),(6,10)$. Preveja $y$ em $x_0=4{,}4$ com (a) KNN com $K=1$, (b) KNN com $K=3$, (c) regressão linear por mínimos quadrados (calcule a reta à mão). Compare.</p>`,
          hints: [
            r`Distâncias a $4{,}4$: $x=5\to0{,}6$; $x=3\to1{,}4$; $x=6\to1{,}6$; $x=2\to2{,}4$; $x=1\to3{,}4$.`,
            r`Reta: $\bar x=3{,}4$, $\bar y=6$, $\sum(x-\bar x)(y-\bar y)=28$, $\sum(x-\bar x)^2=17{,}2$.`,
          ],
          solution: r`<p>(a) $K=1$: vizinho $x=5$, $\hat y=9$.<br>(b) $K=3$: $x=5,3,6$, $\hat y=(9+5+10)/3=8$.<br>(c) $\hat\beta_1=28/17{,}2\approx1{,}628$; $\hat\beta_0=6-1{,}628\cdot3{,}4\approx0{,}465$; $\hat y(4{,}4)\approx0{,}465+7{,}163=7{,}63$.</p><p>Os três diferem: o $K=1$ segue um único ponto (variância alta), o $K=3$ suaviza, e a reta impõe uma forma e dá o valor mais baixo.</p>`,
          rubric: [
            "(a) 9.",
            "(b) 8.",
            "(c) ≈ 7,63, com a reta $\\hat y\\approx0{,}465+1{,}628x$.",
            "Relacionei $K$ e flexibilidade à variância.",
          ],
        },
      ],
      cards: [
        {
          id: "ch03-knn-c1",
          q: "Como o KNN faz previsão em regressão?",
          a: r`Média das respostas $y_i$ dos $K$ vizinhos de treino mais próximos de $x_0$.`,
        },
        {
          id: "ch03-knn-c2",
          q: "Quando a regressão linear vence o KNN e quando perde?",
          a: "Vence quando a relação verdadeira é (quase) linear ou quando $p$ é grande com poucas observações. Perde quando a relação é fortemente não linear e há dados suficientes.",
        },
        {
          id: "ch03-knn-c3",
          q: "O que é a maldição da dimensionalidade?",
          a: "Com $p$ grande, os pontos ficam esparsos: os vizinhos mais próximos de $x_0$ ficam longe, e o KNN deixa de ter “vizinhança local” útil.",
        },
      ],
      deepDive: r`O livro mostra (Figs. 3.17 a 3.20, pp. 113–115) o KNN contra a regressão linear quando a verdade é linear e quando não é, e depois com $p$ crescendo até 20. O laboratório em Python do capítulo está na Seção 3.6 (pp. 116–126), e os exercícios na 3.7.`,
    },
  ],
};
export default ch;

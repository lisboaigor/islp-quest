import type { Chapter } from "@/lib/types";
const r = String.raw;

const ch: Chapter = {
  id: "ch05",
  num: 5,
  title: "Reamostragem",
  pages: "pp. 201–227",
  blurb:
    "Validação cruzada e bootstrap: estimar o erro de teste e a incerteza reusando os mesmos dados.",
  lessons: [
    {
      id: "ch05-validacao",
      title: "Conjunto de validação, LOOCV e k-fold",
      minutes: 14,
      book: "Seções 5.1.1–5.1.3, pp. 202–208",
      hook: "Sem dados de teste de sobra, como saber o erro de teste? Fingindo que parte dos dados é nova.",
      predict: {
        q: "Você divide os dados ao acaso em 50% treino e 50% validação e estima o erro de teste. Repetindo com outra divisão aleatória, a estimativa…",
        options: ["Será idêntica", "Pode mudar bastante", "Sempre fica menor"],
        answer: 1,
        why: r`O resultado depende de quais observações caíram em cada metade, e por isso a estimativa é <b>variável</b>. Além disso, treina-se com menos dados, o que tende a <b>superestimar</b> o erro (Fig. 5.2).`,
      },
      blocks: [
        {
          kind: "text",
          title: "Abordagem do conjunto de validação",
          body: r`<p>Divida as observações ao acaso em <b>treino</b> e <b>validação</b>. Ajuste no treino, meça o erro (MSE) na validação. Dois defeitos: a estimativa varia muito conforme a divisão, e só uma parte dos dados treina o modelo, então tende a superestimar o erro que teríamos com todos os dados.</p>`,
        },
        {
          kind: "key",
          title: "LOOCV: deixar um de fora",
          body: r`<p>Para cada $i$: treine com as $n-1$ observações restantes e calcule $\text{MSE}_i=(y_i-\hat y_i)^2$ na observação deixada de fora. Então</p>$$\text{CV}_{(n)}=\frac1n\sum_{i=1}^n\text{MSE}_i.$$<p>Vantagens: viés baixo (treina com quase tudo) e resultado sempre igual, sem sorteio. Desvantagem: $n$ ajustes.</p>`,
        },
        {
          kind: "key",
          title: "Atalho para mínimos quadrados",
          body: r`<p>Na regressão linear (e polinomial) dá para obter o LOOCV com <b>um único ajuste</b>:</p>$$\text{CV}_{(n)}=\frac1n\sum_{i=1}^n\left(\frac{y_i-\hat y_i}{1-h_i}\right)^2,$$<p>onde $h_i$ é a alavancagem do Capítulo 3.</p>`,
        },
        {
          kind: "key",
          title: "k-fold",
          body: r`<p>Divida os dados em $k$ grupos (<i>folds</i>) do mesmo tamanho. Cada grupo serve uma vez de validação, treinando-se nos outros $k-1$. Com $\text{MSE}_j$ o erro no grupo $j$:</p>$$\text{CV}_{(k)}=\frac1k\sum_{j=1}^k\text{MSE}_j.$$<p>Na prática, $k=5$ ou $10$. LOOCV é o caso $k=n$.</p>`,
          margin: "Com $k=10$ são só 10 ajustes, contra $n$ no LOOCV.",
        },
      ],
      paper: [
        {
          id: "ch05-cv-p1",
          prompt: r`<p>Use os dados do Capítulo 3: $x=(1,2,3,4)$, $y=(2,3,5,6)$, com $\hat y=(1{,}9;\,3{,}3;\,4{,}7;\,6{,}1)$ e alavancagens $h=(0{,}7;\,0{,}3;\,0{,}3;\,0{,}7)$.</p><p>(a) Calcule $\text{CV}_{(n)}$ pelo atalho. (b) Confira o primeiro termo refazendo a regressão sem a observação 1 e prevendo $x=1$.</p>`,
          hints: [
            r`Resíduos $e=y-\hat y=(0{,}1;\,-0{,}3;\,0{,}3;\,-0{,}1)$ e $1-h=(0{,}3;\,0{,}7;\,0{,}7;\,0{,}3)$.`,
            r`(b) Sem a obs. 1 ficam $(2,3),(3,5),(4,6)$: $\bar x=3$, $\bar y=14/3$, $\sum(x-\bar x)(y-\bar y)=3$, $\sum(x-\bar x)^2=2$.`,
          ],
          solution: r`<p>(a) Razões $e_i/(1-h_i)$: $0{,}333;\ -0{,}429;\ 0{,}429;\ -0{,}333$. Quadrados: $0{,}111;\ 0{,}184;\ 0{,}184;\ 0{,}111$. Soma $=0{,}590$; $\text{CV}_{(n)}=0{,}590/4\approx0{,}147$.</p><p>(b) $\hat\beta_1=3/2=1{,}5$, $\hat\beta_0=14/3-1{,}5\cdot3=1/6$. Previsão em $x=1$: $1/6+1{,}5\approx1{,}667$. Erro: $2-1{,}667=0{,}333$, igual ao $e_1/(1-h_1)$ do atalho. ✓</p>`,
          rubric: [
            "Calculei as quatro razões e os quadrados.",
            "$\\text{CV}_{(n)}\\approx0{,}147$.",
            "Refiz sem a obs. 1 e obtive erro $0{,}333$, conferindo com o atalho.",
          ],
        },
        {
          id: "ch05-cv-p2",
          prompt: r`<p>Em 5-fold, os MSE dos grupos foram $4{,}0;\ 6{,}0;\ 5{,}0;\ 7{,}0;\ 3{,}0$. (a) Calcule $\text{CV}_{(5)}$. (b) Com $n=1000$, quantos ajustes fazem LOOCV, 10-fold e a validação simples? (c) Por que o 10-fold costuma ser preferido ao LOOCV, mesmo o LOOCV tendo menos viés?</p>`,
          hints: [
            r`Pense no que acontece com os $n$ conjuntos de treino do LOOCV: eles diferem em uma observação.`,
          ],
          solution: r`<p>(a) $(4+6+5+7+3)/5=5{,}0$.<br>(b) LOOCV: 1000; 10-fold: 10; validação simples: 1.<br>(c) No LOOCV os $n$ modelos são treinados em conjuntos quase idênticos, então suas previsões são <b>muito correlacionadas</b> e a média tem variância alta. O 10-fold tem viés um pouco maior, mas variância menor e custo bem menor.</p>`,
          rubric: [
            "$\\text{CV}_{(5)}=5{,}0$.",
            "1000, 10 e 1 ajustes.",
            "Expliquei a correlação entre os modelos do LOOCV.",
          ],
        },
      ],
      cards: [
        {
          id: "ch05-cv-c1",
          q: "Defeitos da abordagem do conjunto de validação.",
          a: "A estimativa varia muito conforme a divisão aleatória, e treinar com só parte dos dados tende a superestimar o erro de teste.",
        },
        {
          id: "ch05-cv-c2",
          q: "Fórmula do k-fold CV e do atalho do LOOCV para mínimos quadrados.",
          a: r`$\text{CV}_{(k)}=\frac1k\sum\text{MSE}_j$. Atalho: $\text{CV}_{(n)}=\frac1n\sum\big(\frac{y_i-\hat y_i}{1-h_i}\big)^2$.`,
        },
        {
          id: "ch05-cv-c3",
          q: "Compromisso viés-variância do LOOCV versus k-fold (k=5 ou 10).",
          a: "LOOCV: viés menor, variância maior (modelos quase iguais, muito correlacionados). k-fold: viés um pouco maior, variância menor e custo menor.",
        },
      ],
      deepDive: r`A Figura 5.4 (p. 206) compara a estimativa de erro por conjunto de validação (com muitas divisões) com o LOOCV; a p. 208 traz a discussão viés-variância do k-fold com os três cenários simulados.`,
    },

    {
      id: "ch05-cv-classif-bootstrap",
      title: "CV em classificação e o bootstrap",
      minutes: 14,
      book: "Seções 5.1.4–5.2, pp. 208–215",
      hook: "O bootstrap sorteia com reposição para estimar incerteza sem fórmula.",
      blocks: [
        {
          kind: "text",
          title: "CV para classificação",
          body: r`<p>A mesma ideia, trocando MSE pela taxa de erro: $\text{Err}_i=I(y_i\ne\hat y_i)$ e $\text{CV}_{(n)}=\frac1n\sum\text{Err}_i$. Serve para escolher, por exemplo, o grau de um polinômio na logística ou o valor de $K$ no KNN. As curvas de erro de CV costumam ter o U do erro de teste, e o mínimo da curva indica o nível de flexibilidade a usar.</p>`,
        },
        {
          kind: "key",
          title: "O bootstrap",
          body: r`<p>Para medir a incerteza de uma estimativa $\hat\alpha$, o ideal seria repetir o estudo em muitas amostras novas, mas isso não é possível. O <b>bootstrap</b> sorteia $n$ observações <b>com reposição</b> dos dados originais, repetindo isso $B$ vezes. Cada amostra bootstrap dá um $\hat\alpha^{*r}$. O erro-padrão é o desvio-padrão dessas estimativas:</p>$$\text{SE}_B(\hat\alpha)=\sqrt{\frac{1}{B-1}\sum_{r=1}^B\Big(\hat\alpha^{*r}-\bar{\hat\alpha}^{*}\Big)^2}.$$`,
        },
        {
          kind: "text",
          title: "O exemplo do livro: dois investimentos",
          body: r`<p>Aplique uma fração $\alpha$ em $X$ e $1-\alpha$ em $Y$. O $\alpha$ que minimiza o risco é</p>$$\alpha=\frac{\sigma_Y^2-\sigma_{XY}}{\sigma_X^2+\sigma_Y^2-2\sigma_{XY}}.$$<p>Como as variâncias são desconhecidas, estimam-se com os dados, e o bootstrap diz quão confiável é o $\hat\alpha$ resultante.</p>`,
          margin:
            "No livro: $\\sigma_X^2=1$, $\\sigma_Y^2=1{,}25$, $\\sigma_{XY}=0{,}5$ dão $\\alpha=0{,}6$.",
        },
        {
          kind: "warn",
          title: "Cuidado",
          body: r`<p>No bootstrap as observações podem se repetir, e cada amostra bootstrap contém só cerca de <b>dois terços</b> dos pontos originais distintos. Por isso o bootstrap não serve como estimador direto do erro de teste: os pontos “de fora” aparecem no treino.</p>`,
        },
      ],
      paper: [
        {
          id: "ch05-bs-p1",
          prompt: r`<p>(a) Calcule $\alpha$ com $\sigma_X^2=1$, $\sigma_Y^2=1{,}25$, $\sigma_{XY}=0{,}5$. (b) Cinco amostras bootstrap deram $\hat\alpha^*=0{,}55;\,0{,}62;\,0{,}58;\,0{,}65;\,0{,}60$. Calcule o erro-padrão bootstrap.</p>`,
          hints: [
            r`(b) Média $=0{,}60$. Subtraia a média, eleve ao quadrado, some e divida por $B-1=4$.`,
          ],
          solution: r`<p>(a) $\alpha=\dfrac{1{,}25-0{,}5}{1+1{,}25-2(0{,}5)}=\dfrac{0{,}75}{1{,}25}=0{,}6$.<br>(b) Desvios: $-0{,}05;\,0{,}02;\,-0{,}02;\,0{,}05;\,0$. Quadrados: $0{,}0025;\,0{,}0004;\,0{,}0004;\,0{,}0025;\,0$; soma $0{,}0058$. $\text{SE}_B=\sqrt{0{,}0058/4}=\sqrt{0{,}00145}\approx0{,}038$.</p>`,
          rubric: [
            "$\\alpha=0{,}6$.",
            "Soma dos quadrados dos desvios $=0{,}0058$.",
            "$\\text{SE}_B\\approx0{,}038$, dividindo por $B-1$.",
          ],
        },
        {
          id: "ch05-bs-p2",
          prompt: r`<p>Qual a probabilidade de uma observação específica estar numa amostra bootstrap de tamanho $n$? (a) Deduza uma fórmula. (b) Calcule para $n=5$ e $n=100$. (c) Para que valor tende quando $n\to\infty$?</p>`,
          hints: [
            r`A probabilidade de <i>não</i> ser escolhida em um sorteio é $1-1/n$. São $n$ sorteios independentes.`,
          ],
          solution: r`<p>(a) $\Pr(\text{fora})=(1-1/n)^n$, então $\Pr(\text{dentro})=1-(1-1/n)^n$.<br>(b) $n=5$: $1-0{,}8^5=1-0{,}328=0{,}672$. $n=100$: $1-0{,}99^{100}\approx1-0{,}366=0{,}634$.<br>(c) Tende a $1-e^{-1}\approx0{,}632$: cerca de dois terços.</p>`,
          rubric: [
            "Usei $1-(1-1/n)^n$.",
            "0,672 e 0,634.",
            "Limite $\\approx0{,}632$ (cerca de 2/3).",
          ],
        },
      ],
      cards: [
        {
          id: "ch05-bs-c1",
          q: "Como adaptar a CV para classificação?",
          a: r`Troque o MSE pela taxa de erro: $\text{Err}_i=I(y_i\ne\hat y_i)$ e $\text{CV}=\frac1n\sum\text{Err}_i$ (ou média dos folds).`,
        },
        {
          id: "ch05-bs-c2",
          q: "Descreva o bootstrap em duas frases.",
          a: r`Sorteie $n$ observações com reposição dos dados originais, repita $B$ vezes e calcule a estimativa em cada amostra. O desvio-padrão dessas $B$ estimativas é o erro-padrão bootstrap.`,
        },
        {
          id: "ch05-bs-c3",
          q: "Qual a chance de uma observação estar numa amostra bootstrap grande?",
          a: r`$1-(1-1/n)^n\to1-1/e\approx0{,}632$ (cerca de 2/3).`,
        },
      ],
      deepDive: r`A Figura 5.9 (p. 213) mostra histogramas de $\hat\alpha$ em 1.000 conjuntos simulados e em 1.000 amostras bootstrap, e as duas distribuições são muito parecidas. O laboratório Python do capítulo está nas pp. 215–223.`,
    },
  ],
};
export default ch;

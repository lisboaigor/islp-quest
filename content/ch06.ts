import type { Chapter } from "@/lib/types";
const r = String.raw;

const ch: Chapter = {
  id: "ch06",
  num: 6,
  title: "Seleção de modelos e regularização",
  pages: "pp. 229–287",
  blurb:
    "Subconjuntos, ridge, lasso, componentes principais e o que muda quando há mais preditores que observações.",
  lessons: [
    {
      id: "ch06-subconjuntos",
      title: "Seleção de subconjuntos e critérios de escolha",
      minutes: 14,
      book: "Seção 6.1, pp. 231–240",
      hook: "Com 20 preditores existem mais de um milhão de modelos possíveis.",
      predict: {
        q: "Ao adicionar um preditor ao modelo, o RSS de treino e o $R^2$ de treino…",
        options: [
          "Podem piorar",
          "Nunca pioram (RSS não aumenta, $R^2$ não diminui)",
          "Ficam iguais",
        ],
        answer: 1,
        why: r`Mais um preditor nunca aumenta o RSS de treino, e portanto nunca diminui o $R^2$. Por isso eles <b>não servem</b> para comparar modelos de tamanhos diferentes.`,
      },
      blocks: [
        {
          kind: "key",
          title: "Melhor subconjunto e seleção em passos",
          body: r`<p><b>Melhor subconjunto</b>: para cada tamanho $k$, ache o modelo com menor RSS entre todos com $k$ preditores. São $2^p$ modelos no total, inviável para $p$ grande.</p>
<p><b>Seleção passo a passo</b> (<i>stepwise</i>): <b>forward</b> começa vazio e adiciona o preditor que mais melhora o ajuste; <b>backward</b> começa com todos e retira o menos útil. Ajusta só $1+p(p+1)/2$ modelos, mas não garante achar o melhor.</p>`,
        },
        {
          kind: "key",
          title: "Escolher o tamanho",
          body: r`<p>RSS e $R^2$ de treino sempre favorecem o modelo maior. Duas saídas: <b>ajustar</b> o erro de treino pelo tamanho ($C_p$, AIC, BIC, $R^2$ ajustado) ou estimar o erro de teste direto (validação cruzada, Cap. 5).</p>$$C_p=\tfrac1n\big(\text{RSS}+2d\hat\sigma^2\big),\quad \text{BIC}=\tfrac1n\big(\text{RSS}+\log(n)\,d\,\hat\sigma^2\big),\quad R^2_{aj}=1-\frac{\text{RSS}/(n-d-1)}{\text{TSS}/(n-1)}.$$<p>$d$ é o número de preditores. $C_p$ e BIC: menor é melhor. $R^2$ ajustado: maior é melhor.</p>`,
          margin:
            "O BIC pune mais o tamanho que o $C_p$ quando $n>7$, então escolhe modelos menores.",
        },
        {
          kind: "warn",
          title: "Cuidado",
          body: r`<p>O $R^2$ ajustado paga “multa” por cada preditor extra, mas só <i>poucas</i> vezes escolhe um modelo bem menor. Não confie num único critério sem olhar a CV.</p>`,
        },
      ],
      paper: [
        {
          id: "ch06-sub-p1",
          prompt: r`<p>(a) Quantos modelos testa o melhor subconjunto com $p=10$? E com $p=20$? (b) Quantos modelos ajusta a seleção forward (contando o modelo nulo) com $p=10$? E com $p=20$?</p>`,
          hints: [r`Forward: $1+\sum_{k=0}^{p-1}(p-k)=1+p(p+1)/2$.`],
          solution: r`<p>(a) $2^{10}=1024$; $2^{20}=1\,048\,576$.<br>(b) $1+10\cdot11/2=56$; $1+20\cdot21/2=211$.</p>`,
          rubric: [
            "1.024 e cerca de 1,05 milhão.",
            "56 e 211.",
            "Percebi que o forward cresce quadraticamente, e o melhor subconjunto, exponencialmente.",
          ],
        },
        {
          id: "ch06-sub-p2",
          prompt: r`<p>$n=20$, $\text{TSS}=100$, $\hat\sigma^2=2$. Modelos pelo melhor RSS de cada tamanho: $d=1$: $60$; $d=2$: $35$; $d=3$: $33$.</p><p>(a) Calcule $R^2$, $R^2$ ajustado e $\text{RSS}+2d\hat\sigma^2$ (proporcional ao $C_p$) de cada um. (b) Qual modelo cada critério escolhe? (c) O que o $R^2$ comum faria?</p>`,
          hints: [r`$R^2_{aj}=1-\dfrac{\text{RSS}/(20-d-1)}{100/19}$.`],
          solution: r`<p>$R^2$: $0{,}40;\ 0{,}65;\ 0{,}67$.<br>$R^2_{aj}$: $d=1$: $1-\frac{60/18}{100/19}=0{,}367$; $d=2$: $1-\frac{35/17}{100/19}=0{,}609$; $d=3$: $1-\frac{33/16}{100/19}=0{,}608$.<br>$\text{RSS}+4d$: $64;\ 43;\ 45$.</p><p>(b) $R^2_{aj}$ e $C_p$ escolhem $d=2$. (c) O $R^2$ comum cresce sempre e escolheria $d=3$, mesmo com ganho mínimo (0,65 → 0,67) que não compensa o parâmetro extra.</p>`,
          rubric: [
            "$R^2$: 0,40; 0,65; 0,67.",
            "$R^2_{aj}$ máximo em $d=2$ (0,609 vs 0,608).",
            "$C_p$ mínimo em $d=2$.",
            "Entendi que o $R^2$ comum favorece o maior modelo.",
          ],
        },
      ],
      cards: [
        {
          id: "ch06-sub-c1",
          q: "Por que RSS e $R^2$ de treino não servem para escolher o tamanho do modelo?",
          a: "RSS nunca aumenta e $R^2$ nunca diminui ao adicionar preditores; sempre favorecem o modelo maior.",
        },
        {
          id: "ch06-sub-c2",
          q: "Quantos modelos o melhor subconjunto e o forward estimam?",
          a: r`Melhor subconjunto: $2^p$. Forward: $1+p(p+1)/2$.`,
        },
        {
          id: "ch06-sub-c3",
          q: "Critérios que penalizam o tamanho: nomes e direção.",
          a: r`$C_p$, AIC, BIC: menor é melhor. $R^2$ ajustado: maior é melhor. Alternativa: validação cruzada.`,
        },
      ],
    },

    {
      id: "ch06-ridge-lasso",
      title: "Ridge e lasso: encolher os coeficientes",
      minutes: 16,
      book: "Seção 6.2, pp. 240–253",
      hook: "Pagar um pouco de viés para reduzir muito a variância.",
      predict: {
        q: "Qual dos dois métodos pode zerar coeficientes exatamente (fazer seleção de variáveis)?",
        options: ["Ridge", "Lasso", "Os dois"],
        answer: 1,
        why: r`O lasso usa penalidade $\ell_1$ ($\sum|\beta_j|$), que gera coeficientes <b>exatamente zero</b>. O ridge ($\ell_2$) os encolhe mas raramente os zera.`,
      },
      blocks: [
        {
          kind: "key",
          title: "Ridge",
          body: r`<p>Em vez de minimizar só o RSS, minimiza-se</p>$$\text{RSS}+\lambda\sum_{j=1}^p\beta_j^2,\qquad \lambda\ge0.$$<p>$\lambda=0$ é mínimos quadrados; $\lambda\to\infty$ leva todos os $\beta_j$ a 0. O intercepto não é penalizado. Cada $\lambda$ dá um conjunto diferente de coeficientes, escolhido por validação cruzada.</p>`,
        },
        {
          kind: "key",
          title: "Lasso",
          body: r`$$\text{RSS}+\lambda\sum_{j=1}^p|\beta_j|.$$<p>A penalidade $\ell_1$ força alguns coeficientes a <b>exatamente zero</b> quando $\lambda$ é grande: o lasso faz <b>seleção de variáveis</b> e produz modelos esparsos, mais fáceis de interpretar.</p>`,
          margin:
            "Geometria: a região de restrição do lasso é um losango, do ridge um círculo. A elipse do RSS tende a tocar o losango numa quina, onde um $\\beta_j=0$ (Fig. 6.7).",
        },
        {
          kind: "text",
          title: "Por que funciona: viés-variância",
          body: r`<p>Aumentar $\lambda$ reduz a flexibilidade: <b>variância cai</b> e <b>viés sobe</b>. Quando mínimos quadrados tem variância alta (muitos preditores, poucos dados), o MSE de teste melhora com $\lambda>0$.</p>`,
        },
        {
          kind: "warn",
          title: "Padronize antes",
          body: r`<p>Mínimos quadrados é “equivariante à escala”: mudar a unidade de $X_j$ só reescala $\hat\beta_j$. Ridge e lasso <b>não são</b>: a penalidade depende da escala. Por isso padroniza-se cada preditor (média 0, desvio-padrão 1) antes de ajustar.</p>`,
        },
      ],
      paper: [
        {
          id: "ch06-rl-p1",
          prompt: r`<p>Um preditor, sem intercepto, com $\sum x_i^2=1$ e estimativa de mínimos quadrados $\hat\beta^{LS}$.</p><p>(a) Deduza, derivando, que o ridge dá $\hat\beta^R=\hat\beta^{LS}/(1+\lambda)$. (b) Para o lasso com a mesma escala, o resultado é $\operatorname{sinal}(\hat\beta^{LS})\big(|\hat\beta^{LS}|-\lambda/2\big)_+$. Calcule ridge e lasso para $\hat\beta^{LS}=3$, $\lambda=2$ e depois para $\hat\beta^{LS}=0{,}8$, $\lambda=2$. (c) O que isso mostra?</p>`,
          hints: [
            r`(a) Minimize $\sum(y_i-\beta x_i)^2+\lambda\beta^2$. Derivada $=-2\sum x_i(y_i-\beta x_i)+2\lambda\beta=0$.`,
            r`$(z)_+$ é $z$ se $z>0$ e 0 caso contrário.`,
          ],
          solution: r`<p>(a) $\beta(\sum x_i^2+\lambda)=\sum x_iy_i\Rightarrow\hat\beta^R=\dfrac{\sum x_iy_i}{1+\lambda}=\dfrac{\hat\beta^{LS}}{1+\lambda}$ (pois $\hat\beta^{LS}=\sum x_iy_i$ quando $\sum x_i^2=1$).</p><p>(b) $\hat\beta^{LS}=3$, $\lambda=2$: ridge $=3/3=1$; lasso $=3-1=2$. $\hat\beta^{LS}=0{,}8$: ridge $=0{,}8/3\approx0{,}267$; lasso $=(0{,}8-1)_+=0$.</p><p>(c) O ridge <b>encolhe proporcionalmente</b> e nunca chega a zero. O lasso <b>subtrai uma constante</b> e zera coeficientes pequenos: seleção de variáveis.</p>`,
          rubric: [
            "Derivei $\\hat\\beta^R=\\hat\\beta^{LS}/(1+\\lambda)$.",
            "Ridge 1 e 0,267; lasso 2 e 0.",
            "Concluí: ridge encolhe proporcionalmente; lasso zera os pequenos.",
          ],
        },
      ],
      spot: {
        intro: r`<p>Beto resume ridge e lasso. <b>Onde está o erro?</b></p>`,
        steps: [
          r`Os dois adicionam ao RSS uma penalidade proporcional a $\lambda$.`,
          r`Com $\lambda=0$ ambos recuperam mínimos quadrados.`,
          r`Como o ridge e o lasso dependem da escala dos preditores, devo padronizá-los antes.`,
          r`Aumentar $\lambda$ diminui o viés e aumenta a variância.`,
        ],
        wrong: 3,
        why: r`É o contrário: $\lambda$ maior deixa o modelo <b>menos flexível</b>, então a variância <b>cai</b> e o viés <b>sobe</b>.`,
      },
      cards: [
        {
          id: "ch06-rl-c1",
          q: "Funções objetivo do ridge e do lasso.",
          a: r`Ridge: $\text{RSS}+\lambda\sum\beta_j^2$. Lasso: $\text{RSS}+\lambda\sum|\beta_j|$.`,
        },
        {
          id: "ch06-rl-c2",
          q: "Qual a diferença prática entre ridge e lasso?",
          a: "O lasso zera coeficientes (seleção de variáveis, modelo esparso); o ridge só os encolhe, mantendo todos.",
        },
        {
          id: "ch06-rl-c3",
          q: "Por que padronizar preditores antes de ridge/lasso e como escolher $\\lambda$?",
          a: r`A penalidade depende da escala, mínimos quadrados não. $\lambda$ se escolhe por validação cruzada.`,
        },
        {
          id: "ch06-rl-c4",
          q: "Efeito de aumentar $\\lambda$ sobre viés e variância.",
          a: "Variância diminui, viés aumenta; o MSE de teste tem forma de U em $\\lambda$.",
        },
      ],
      deepDive: r`As Figuras 6.4 e 6.5 (pp. 241–243) mostram a queda da variância e a subida do viés com $\lambda$ no ridge. A Figura 6.7 (p. 247) é a imagem geométrica losango contra círculo, e a Seção 6.2.3 (p. 252) explica como escolher $\lambda$ por validação cruzada.`,
    },

    {
      id: "ch06-reducao",
      title: "Redução de dimensão: PCR e PLS",
      minutes: 12,
      book: "Seção 6.3, pp. 253–262",
      hook: "Em vez de escolher preditores, criar poucas combinações deles.",
      blocks: [
        {
          kind: "key",
          title: "A ideia",
          body: r`<p>Construa $M<p$ combinações lineares dos preditores, $Z_m=\sum_j\phi_{jm}X_j$, e regrida $Y$ nessas $M$ variáveis. Estimam-se só $M+1$ coeficientes em vez de $p+1$. Os métodos diferem em <i>como</i> escolher os $\phi_{jm}$.</p>`,
        },
        {
          kind: "text",
          title: "PCR: componentes principais",
          body: r`<p>A primeira componente principal é a direção de <b>maior variância</b> dos preditores; a segunda é a de maior variância ortogonal à primeira, e assim por diante. O PCR regride $Y$ nas primeiras $M$ componentes. Funciona bem quando as direções de maior variância de $X$ também explicam $Y$.</p>`,
        },
        {
          kind: "warn",
          title: "PCR é não supervisionado",
          body: r`<p>As componentes são escolhidas olhando só para $X$, sem ver $Y$. Nada garante que a direção de maior variância seja a mais útil para prever $Y$. PCR não faz seleção de variáveis: cada componente mistura todos os preditores. Padronize os preditores antes.</p>`,
        },
        {
          kind: "text",
          title: "PLS: mínimos quadrados parciais",
          body: r`<p>Alternativa <b>supervisionada</b>: constrói as direções usando também $Y$, dando mais peso aos preditores mais associados à resposta. Na prática costuma reduzir o viés mas pode aumentar a variância, e muitas vezes não supera ridge ou PCR.</p>`,
        },
      ],
      paper: [
        {
          id: "ch06-pcr-p1",
          prompt: r`<p>Duas variáveis padronizadas $X_1,X_2$, com a primeira componente principal $Z_1=0{,}6\,X_1+0{,}8\,X_2$. (a) Confira que os pesos têm norma 1. (b) Calcule $Z_1$ para os pontos $(1,2)$ e $(-1,0{,}5)$. (c) Explique por que PCR pode falhar mesmo que $Z_1$ tenha variância enorme.</p>`,
          hints: [r`Norma: $\phi_1^2+\phi_2^2=1$.`],
          solution: r`<p>(a) $0{,}36+0{,}64=1$ ✓.<br>(b) $(1,2)$: $0{,}6+1{,}6=2{,}2$. $(-1,0{,}5)$: $-0{,}6+0{,}4=-0{,}2$.<br>(c) A $Z_1$ foi escolhida para maximizar a variância de $X$, sem usar $Y$. Se a variação útil para $Y$ está numa direção de variância pequena, o PCR com poucas componentes a descarta.</p>`,
          rubric: [
            "Norma 1 conferida.",
            "$Z_1=2{,}2$ e $-0{,}2$.",
            "Expliquei que o PCR escolhe direções sem olhar para $Y$.",
          ],
        },
      ],
      cards: [
        {
          id: "ch06-pcr-c1",
          q: "Como o PCR funciona e por que é não supervisionado?",
          a: "Regride $Y$ nas $M$ primeiras componentes principais de $X$. As componentes maximizam a variância de $X$ sem usar $Y$.",
        },
        {
          id: "ch06-pcr-c2",
          q: "Diferença entre PCR e PLS.",
          a: "O PLS é supervisionado: usa $Y$ para construir as direções; o PCR escolhe direções só com $X$.",
        },
      ],
      deepDive: r`A Figura 6.14 (p. 254) mostra a primeira componente principal de dados de população e gasto com anúncios; o PCR e sua escolha de $M$ por validação cruzada estão na Seção 6.3.1 (pp. 254–260). O laboratório Python da p. 280 mostra PCR e PLS com validação cruzada.`,
    },

    {
      id: "ch06-alta-dim",
      title: "Quando há mais preditores que observações",
      minutes: 12,
      book: "Seção 6.4, pp. 262–267",
      hook: "Com $p\\ge n$, um modelo de puro ruído pode ter $R^2=1$.",
      blocks: [
        {
          kind: "key",
          title: "O que quebra",
          body: r`<p>Quando $p\ge n$, mínimos quadrados consegue um ajuste <b>perfeito</b> nos dados de treino: $\text{RSS}=0$ e $R^2=1$, ainda que os preditores sejam ruído puro. O modelo decorou o treino e o erro de teste é péssimo (Fig. 6.22).</p>`,
        },
        {
          kind: "text",
          title: "Estatísticas enganosas",
          body: r`<p>$C_p$, AIC, BIC e $R^2$ ajustado usam $\hat\sigma^2$, que fica mal estimado (pode ser zero) e as fórmulas deixam de funcionar. Com $d=n-1$, o denominador de $R^2_{aj}$ é zero.</p>`,
        },
        {
          kind: "key",
          title: "O que usar",
          body: r`<p>Métodos <b>menos flexíveis</b> e regularizados: ridge, lasso, PCR, PLS, com validação cruzada para escolher o nível de regularização. Nunca relate o $R^2$ ou o MSE de <b>treino</b> como evidência de qualidade.</p>`,
        },
        {
          kind: "warn",
          title: "Cuidado ao interpretar",
          body: r`<p>Com muitos preditores, a <b>multicolinearidade é extrema</b>: qualquer variável pode ser escrita como combinação das outras. Mesmo o lasso que “escolheu” certas variáveis não prova que elas são <i>as</i> importantes: apenas que formam um bom preditor entre vários possíveis. Relate sempre erro de <b>teste</b> ou de CV.</p>`,
        },
      ],
      paper: [
        {
          id: "ch06-hd-p1",
          prompt: r`<p>Você tem $n=20$ observações e $p=19$ preditores gerados como ruído puro, mais intercepto. (a) Quantos parâmetros tem o modelo? (b) Qual é o RSS de treino e o $R^2$ de treino? (c) Tente calcular o $R^2$ ajustado: o que acontece? (d) Qual o erro de teste esperado e o que você faria?</p>`,
          hints: [r`Com 20 parâmetros e 20 observações, o sistema linear tem solução exata.`],
          solution: r`<p>(a) $19+1=20$ parâmetros.<br>(b) O modelo passa por todos os pontos: $\text{RSS}=0$ e $R^2=1$.<br>(c) $R^2_{aj}=1-\frac{\text{RSS}/(n-d-1)}{\text{TSS}/(n-1)}$ com $n-d-1=20-19-1=0$: divisão por zero, indefinido.<br>(d) O erro de teste será alto (o modelo só decorou ruído; no máximo tão bom quanto a média de $Y$, e em geral pior). Use ridge/lasso com validação cruzada e avalie o erro de teste.</p>`,
          rubric: [
            "20 parâmetros.",
            "RSS $=0$ e $R^2=1$.",
            "Percebi a divisão por zero no $R^2$ ajustado.",
            "Propus regularização com CV e erro de teste.",
          ],
        },
      ],
      cards: [
        {
          id: "ch06-hd-c1",
          q: "O que acontece com mínimos quadrados quando $p\\ge n$?",
          a: "Ajusta os dados de treino perfeitamente (RSS = 0, R² = 1), mesmo com ruído puro; o erro de teste é ruim (overfitting).",
        },
        {
          id: "ch06-hd-c2",
          q: "Que abordagem usar em alta dimensão e que métricas evitar?",
          a: "Métodos regularizados (ridge, lasso, PCR, PLS) com CV. Evitar R², RSS, Cp, AIC e BIC de treino: ficam enganosos.",
        },
      ],
      deepDive: r`As Figuras 6.22 e 6.23 (pp. 264–266) mostram o ajuste perfeito quando $p\approx n$ e o $R^2$ de treino subindo enquanto o erro de teste piora. O laboratório da Seção 6.5 (pp. 267–282) usa os dados Hitters.`,
    },
  ],
};
export default ch;

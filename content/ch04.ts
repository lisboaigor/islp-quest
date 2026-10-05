import type { Chapter } from "@/lib/types";
const r = String.raw;

const ch: Chapter = {
  id: "ch04",
  num: 4,
  title: "Classificação",
  pages: "pp. 135–199",
  blurb: "Regressão logística, LDA, QDA, Naive Bayes e como escolher entre eles.",
  lessons: [
    {
      id: "ch04-logistica",
      title: "Por que não regressão linear, e o modelo logístico",
      minutes: 12,
      book: "Seções 4.1–4.3.1, pp. 135–140",
      hook: "Uma reta pode prever probabilidade −0,3. Isso é um problema.",
      predict: {
        q: "Você codifica “não inadimplente = 0” e “inadimplente = 1” e ajusta regressão linear. As previsões para alguns clientes podem ser…",
        options: ["Sempre entre 0 e 1", "Menores que 0 ou maiores que 1", "Sempre 0 ou 1"],
        answer: 1,
        why: r`Uma reta não tem limite, então pode sair do intervalo $[0,1]$ para valores extremos de $X$. Não dá para ler isso como probabilidade (Fig. 4.2 do livro).`,
      },
      blocks: [
        {
          kind: "text",
          title: "O problema da regressão linear",
          body: r`<p>Com mais de duas classes sem ordem natural (ex.: AVC, overdose, convulsão), qualquer codificação 1, 2, 3 impõe uma ordem e distâncias que não existem. Com duas classes, a codificação 0/1 funciona, mas as previsões podem sair de $[0,1]$.</p>`,
        },
        {
          kind: "key",
          title: "O modelo logístico",
          body: r`<p>Modelamos a probabilidade $p(X)=\Pr(Y=1\mid X)$ com uma função que fica sempre entre 0 e 1:</p>$$p(X)=\frac{e^{\beta_0+\beta_1X}}{1+e^{\beta_0+\beta_1X}}.$$<p>É uma curva em S. Mesmo com $X$ muito grande ou pequeno, $p(X)$ fica entre 0 e 1.</p>`,
        },
        {
          kind: "key",
          title: "Odds e log-odds",
          body: r`<p>Rearranjando:</p>$$\frac{p(X)}{1-p(X)}=e^{\beta_0+\beta_1X}\quad\text{(odds)},\qquad \log\frac{p(X)}{1-p(X)}=\beta_0+\beta_1X\quad\text{(logit)}.$$<p>O <b>logit</b> é linear em $X$. Aumentar $X$ em 1 unidade soma $\beta_1$ ao log-odds, ou seja, <b>multiplica o odds por $e^{\beta_1}$</b>.</p>`,
          margin:
            "Odds de 1/4 equivalem a probabilidade de 1/5. Odds $=p/(1-p)$; $p=\\text{odds}/(1+\\text{odds})$.",
        },
        {
          kind: "warn",
          title: "Cuidado",
          body: r`<p>$\beta_1$ <b>não</b> é a variação de $p(X)$ por unidade de $X$. A relação entre $X$ e $p(X)$ é uma curva: o efeito sobre a probabilidade depende de onde você está.</p>`,
        },
      ],
      paper: [
        {
          id: "ch04-log-p1",
          prompt: r`<p>(a) Converta: probabilidade $0{,}2$ em odds; odds de $3$ em probabilidade. (b) Se $\log(\text{odds})=-1{,}2+0{,}5x$, qual é a probabilidade em $x=2$? (c) Em quanto o odds se multiplica quando $x$ sobe 1 unidade?</p>`,
          hints: [
            r`$\text{odds}=p/(1-p)$; $p=\text{odds}/(1+\text{odds})$.`,
            r`Em (b), calcule o logit, depois $e^{\text{logit}}$, depois $p$.`,
          ],
          solution: r`<p>(a) $0{,}2/0{,}8=0{,}25$. Odds 3: $p=3/4=0{,}75$.<br>(b) Logit $=-1{,}2+1=-0{,}2$; odds $=e^{-0{,}2}\approx0{,}8187$; $p=0{,}8187/1{,}8187\approx0{,}450$.<br>(c) $e^{0{,}5}\approx1{,}649$: o odds sobe cerca de 65% a cada unidade de $x$.</p>`,
          rubric: [
            "Odds $=0{,}25$ e $p=0{,}75$.",
            "$p\\approx0{,}45$ em $x=2$.",
            "Multiplicador $e^{0{,}5}\\approx1{,}65$ (não uma soma na probabilidade).",
          ],
        },
      ],
      cards: [
        {
          id: "ch04-log-c1",
          q: "Por que não usar regressão linear para classificação?",
          a: "Com 3+ classes sem ordem, a codificação numérica impõe ordem artificial. Com 2 classes, as previsões podem sair de [0,1] e não são probabilidades.",
        },
        {
          id: "ch04-log-c2",
          q: "Escreva $p(X)$ da regressão logística e o logit.",
          a: r`$p(X)=\dfrac{e^{\beta_0+\beta_1X}}{1+e^{\beta_0+\beta_1X}}$; $\log\dfrac{p}{1-p}=\beta_0+\beta_1X$.`,
        },
        {
          id: "ch04-log-c3",
          q: r`O que acontece com o odds quando $X$ aumenta 1 unidade?`,
          a: r`Multiplica-se por $e^{\beta_1}$ (o log-odds soma $\beta_1$).`,
        },
      ],
    },

    {
      id: "ch04-logistica-uso",
      title: "Ajustar e interpretar: verossimilhança e o caso do estudante",
      minutes: 14,
      book: "Seções 4.3.2–4.3.5, pp. 140–146",
      hook: "Cartão de crédito: estudantes são mais arriscados, e ao mesmo tempo menos arriscados. Os dois são verdade.",
      blocks: [
        {
          kind: "key",
          title: "Máxima verossimilhança",
          body: r`<p>Em vez de mínimos quadrados, escolhemos $\hat\beta_0,\hat\beta_1$ que maximizam a <b>verossimilhança</b>: a probabilidade que o modelo atribui aos dados observados,</p>$$\ell(\beta_0,\beta_1)=\prod_{i:y_i=1}p(x_i)\prod_{i':y_{i'}=0}\big(1-p(x_{i'})\big).$$<p>Uma curva que dá alta probabilidade ao que de fato aconteceu tem verossimilhança alta.</p>`,
        },
        {
          kind: "text",
          title: "Previsão no exemplo Default",
          body: r`<p>Para prever inadimplência a partir do saldo (<code>balance</code>), o livro obtém $\hat\beta_0=-10{,}6513$ e $\hat\beta_1=0{,}0055$. Com saldo de 1.000, $\hat p=0{,}00576$ (0,576%). Com 2.000, $\hat p\approx0{,}586$.</p>`,
          margin:
            "A variável qualitativa <code>student</code> entra com uma dummy, igual na regressão linear.",
        },
        {
          kind: "analogy",
          title: "O paradoxo do estudante",
          body: r`<p>Sozinha, a variável “estudante” tem coeficiente <b>positivo</b>: estudantes inadimplem mais. Com saldo no modelo, o coeficiente fica <b>negativo</b>: <i>para um mesmo saldo</i>, estudante é menos arriscado. Resolve-se assim: estudantes tendem a ter saldos maiores, e saldo alto leva a inadimplência. É <b>confundimento</b>.</p>`,
        },
        {
          kind: "text",
          title: "Mais de duas classes",
          body: r`<p>A <b>regressão logística multinomial</b> escolhe uma classe de referência e modela o log-odds das demais contra ela. A versão com <i>softmax</i> trata todas as classes simetricamente e é a forma usada em redes neurais.</p>`,
        },
      ],
      paper: [
        {
          id: "ch04-ver-p1",
          prompt: r`<p>Dados: $y=(0,0,1,1)$ com $x=(1,2,3,4)$. O modelo A prevê $p=(0{,}2;\,0{,}4;\,0{,}6;\,0{,}8)$ e o modelo B prevê $p=0{,}5$ para todos. Calcule a verossimilhança $\prod$ de cada um e diga qual o máxima verossimilhança preferiria.</p>`,
          hints: [r`Para $y_i=1$ use $p_i$; para $y_i=0$ use $1-p_i$.`],
          solution: r`<p>A: $(1-0{,}2)(1-0{,}4)(0{,}6)(0{,}8)=0{,}8\cdot0{,}6\cdot0{,}6\cdot0{,}8=0{,}2304$.<br>B: $0{,}5^4=0{,}0625$.<br>A tem verossimilhança maior: o método a preferiria, pois atribui mais probabilidade ao que de fato ocorreu.</p>`,
          rubric: [
            "Usei $1-p$ para os $y=0$ e $p$ para os $y=1$.",
            "A $=0{,}2304$ e B $=0{,}0625$.",
            "Concluí que A é melhor.",
          ],
        },
        {
          id: "ch04-ver-p2",
          prompt: r`<p>Com $\hat\beta_0=-10{,}6513$, $\hat\beta_1=0{,}0055$ (saldo em dólares): (a) calcule $\hat p$ para saldo 2.000 à mão (ou com calculadora). (b) Para qual saldo $\hat p=0{,}5$? (c) Em quanto o odds se multiplica a cada 100 dólares a mais de saldo?</p>`,
          hints: [r`(b) $p=0{,}5$ significa logit $=0$. Resolva $\hat\beta_0+\hat\beta_1x=0$.`],
          solution: r`<p>(a) Logit $=-10{,}6513+0{,}0055\cdot2000=0{,}3487$; $e^{0{,}3487}\approx1{,}417$; $\hat p=1{,}417/2{,}417\approx0{,}586$.<br>(b) $x=10{,}6513/0{,}0055\approx1936{,}6$.<br>(c) $e^{0{,}0055\cdot100}=e^{0{,}55}\approx1{,}73$.</p>`,
          rubric: ["(a) ≈ 0,586.", "(b) ≈ 1.937.", "(c) ≈ 1,73."],
        },
      ],
      cards: [
        {
          id: "ch04-ver-c1",
          q: "O que a máxima verossimilhança maximiza na regressão logística?",
          a: "A probabilidade conjunta que o modelo atribui aos rótulos observados: produto de $p(x_i)$ para $y_i=1$ e $1-p(x_i)$ para $y_i=0$.",
        },
        {
          id: "ch04-ver-c2",
          q: "Explique o paradoxo do estudante em Default.",
          a: "Sozinho, estudante tem coeficiente positivo; com saldo no modelo, negativo. Estudantes têm saldos maiores (que aumentam o risco), mas, para o mesmo saldo, são menos arriscados: confundimento.",
        },
      ],
      deepDive: r`A Figura 4.3 (p. 144) mostra o paradoxo do estudante em gráficos: taxa de inadimplência por saldo para estudantes e não estudantes, e a distribuição de saldo por grupo. A p. 144 introduz o <i>softmax</i> para múltiplas classes.`,
    },

    {
      id: "ch04-lda",
      title: "Modelos generativos e a LDA",
      minutes: 14,
      book: "Seções 4.4–4.4.1, pp. 146–150",
      hook: "Em vez de modelar $P(Y|X)$ direto, modelamos como $X$ se distribui em cada classe e invertemos com Bayes.",
      blocks: [
        {
          kind: "key",
          title: "A inversão de Bayes",
          body: r`<p>Seja $\pi_k$ a probabilidade <b>a priori</b> da classe $k$ e $f_k(x)$ a densidade de $X$ dentro dessa classe. O teorema de Bayes dá</p>$$\Pr(Y=k\mid X=x)=\frac{\pi_kf_k(x)}{\sum_{l=1}^K\pi_lf_l(x)}.$$<p>Estimamos $\pi_k$ (fração de treino na classe $k$) e $f_k$, e classificamos na classe de maior probabilidade.</p>`,
          margin:
            "Motivos para preferir isto à logística: classes bem separadas (logística fica instável), poucas observações com $X$ aproximadamente normal, e mais de duas classes.",
        },
        {
          kind: "key",
          title: "LDA com um preditor",
          body: r`<p>Suponha $f_k$ normal com média $\mu_k$ e <b>variância comum</b> $\sigma^2$. Então classificar em $k$ equivale a maximizar a <b>função discriminante</b></p>$$\delta_k(x)=x\cdot\frac{\mu_k}{\sigma^2}-\frac{\mu_k^2}{2\sigma^2}+\log\pi_k,$$<p>que é <b>linear em $x$</b>. Com duas classes e $\pi_1=\pi_2$, a fronteira é o ponto médio $x=\tfrac{\mu_1+\mu_2}{2}$.</p>`,
        },
        {
          kind: "text",
          title: "Estimativas usadas",
          body: r`<p>Na prática, $\hat\mu_k$ é a média amostral da classe $k$, $\hat\sigma^2$ é a variância combinada das classes, e $\hat\pi_k=n_k/n$. O livro chama o resultado de <b>LDA</b> (análise discriminante linear).</p>`,
        },
        {
          kind: "warn",
          title: "Cuidado",
          body: r`<p>A fronteira ótima de Bayes só vale se as suposições (normalidade e variância comum) forem verdadeiras. A LDA aproxima essa fronteira a partir dos dados.</p>`,
        },
      ],
      paper: [
        {
          id: "ch04-lda-p1",
          prompt: r`<p>Duas classes normais com $\mu_1=2$, $\mu_2=6$, $\sigma^2=4$. (a) Com $\pi_1=\pi_2=0{,}5$, onde está a fronteira? Em qual classe cai $x=5$? (b) Agora $\pi_1=0{,}8$, $\pi_2=0{,}2$. Deduza a fronteira igualando $\delta_1=\delta_2$. (c) Em qual classe cai $x=5$ agora? Explique.</p>`,
          hints: [
            r`$\delta_1-\delta_2=x\frac{\mu_1-\mu_2}{\sigma^2}-\frac{\mu_1^2-\mu_2^2}{2\sigma^2}+\log\frac{\pi_1}{\pi_2}$.`,
            r`Substitua: $\frac{\mu_1-\mu_2}{\sigma^2}=-1$ e $\frac{\mu_1^2-\mu_2^2}{2\sigma^2}=-4$.`,
          ],
          solution: r`<p>(a) $x=(2+6)/2=4$. $x=5>4$: classe 2.</p><p>(b) $\delta_1-\delta_2=-x+4+\log4=0\Rightarrow x=4+\ln4\approx5{,}386$. Classe 1 se $x<5{,}386$.</p><p>(c) $x=5<5{,}386$: <b>classe 1</b>. O prior maior da classe 1 empurra a fronteira para perto da classe 2, ampliando a região atribuída à classe 1.</p>`,
          rubric: [
            "Fronteira em 4 e $x=5$ na classe 2 com priors iguais.",
            "Obtive $x=4+\\ln4\\approx5{,}39$.",
            "$x=5$ vira classe 1 e expliquei pelo prior.",
          ],
        },
      ],
      cards: [
        {
          id: "ch04-lda-c1",
          q: "Escreva o teorema de Bayes para classificação.",
          a: r`$\Pr(Y=k|X=x)=\dfrac{\pi_kf_k(x)}{\sum_l\pi_lf_l(x)}$, com $\pi_k$ a priori e $f_k$ a densidade de $X$ na classe $k$.`,
        },
        {
          id: "ch04-lda-c2",
          q: "Quais suposições a LDA com $p=1$ faz e qual a forma de $\\delta_k(x)$?",
          a: r`$f_k$ normal com variância comum $\sigma^2$. $\delta_k(x)=x\mu_k/\sigma^2-\mu_k^2/(2\sigma^2)+\log\pi_k$, linear em $x$.`,
        },
        {
          id: "ch04-lda-c3",
          q: "O que o prior $\\pi_k$ faz na fronteira de decisão?",
          a: "Classes com prior maior ganham região maior: a fronteira se desloca na direção da outra classe.",
        },
      ],
      deepDive: r`A equação (4.17) e a dedução de $\delta_k$ estão nas pp. 147–148, e a Figura 4.4 mostra a fronteira de Bayes e a LDA estimada com 20 observações por classe.`,
    },

    {
      id: "ch04-lda-qda-nb",
      title: "LDA com vários preditores, QDA, Naive Bayes e a matriz de confusão",
      minutes: 16,
      book: "Seções 4.4.2–4.4.4, pp. 150–161",
      hook: "Acertar 97% e ainda assim deixar passar dois terços dos inadimplentes.",
      blocks: [
        {
          kind: "text",
          title: "De p = 1 para p > 1",
          body: r`<p>A <b>LDA</b> supõe $X\sim N(\mu_k,\boldsymbol\Sigma)$: normal multivariada com <b>mesma covariância</b> em todas as classes. A fronteira continua linear. A <b>QDA</b> permite uma covariância $\boldsymbol\Sigma_k$ por classe e a fronteira vira <b>quadrática</b>.</p>`,
        },
        {
          kind: "key",
          title: "Viés e variância de novo",
          body: r`<p>Com $p$ preditores, a covariância tem $p(p+1)/2$ parâmetros. LDA estima <b>uma</b>; QDA estima <b>$K$</b>. A QDA é mais flexível (viés menor, variância maior) e pede mais dados. Se a covariância comum é razoável, a LDA ganha em amostras pequenas.</p>`,
        },
        {
          kind: "text",
          title: "Naive Bayes",
          body: r`<p>Supõe que, <b>dentro de cada classe</b>, os preditores são independentes: $f_k(x)=f_{k1}(x_1)\cdots f_{kp}(x_p)$. Isso corta drasticamente o que precisa ser estimado, e funciona surpreendentemente bem mesmo quando a suposição é falsa, em especial com $p$ grande.</p>`,
        },
        {
          kind: "key",
          title: "Matriz de confusão e limiar",
          body: r`<p>Para avaliar um classificador de duas classes, tabela-se previsto × real. <b>Sensibilidade</b> $=\text{VP}/(\text{VP}+\text{FN})$ (fração dos positivos reais encontrados). <b>Especificidade</b> $=\text{VN}/(\text{VN}+\text{FP})$. Mudar o limiar de $0{,}5$ para menos troca falsos negativos por falsos positivos. A <b>curva ROC</b> resume essa troca, e a <b>AUC</b> resume a curva.</p>`,
        },
        {
          kind: "warn",
          title: "Cuidado",
          body: r`<p>Quando uma classe é rara, um classificador que <i>sempre</i> prevê a classe comum tem erro baixo. A taxa de erro global não basta; olhe a sensibilidade.</p>`,
        },
      ],
      paper: [
        {
          id: "ch04-cm-p1",
          prompt: r`<p>10.000 clientes: 300 inadimplentes reais e 9.700 não. O modelo marcou como inadimplentes 150 clientes, dos quais 100 realmente inadimplem. Monte a matriz de confusão e calcule: erro global, sensibilidade, especificidade e a taxa de falsos positivos. Compare o erro global com o do classificador que <i>nunca</i> prevê inadimplência.</p>`,
          hints: [r`VP $=100$. FP $=150-100=50$. FN $=300-100=200$. VN $=9700-50$.`],
          solution: r`<p>VP $=100$, FP $=50$, FN $=200$, VN $=9650$.<br>Erro global $=(200+50)/10000=2{,}5\%$.<br>Sensibilidade $=100/300\approx33{,}3\%$.<br>Especificidade $=9650/9700\approx99{,}5\%$; FPR $\approx0{,}5\%$.<br>Classificador “nunca inadimplente”: erro $=300/10000=3\%$. O modelo (2,5%) mal o supera e deixa passar <b>dois terços</b> dos inadimplentes.</p>`,
          rubric: [
            "Matriz: 100, 50, 200, 9650.",
            "Erro 2,5% e comparação com 3%.",
            "Sensibilidade ≈ 33% e especificidade ≈ 99,5%.",
            "Concluí que erro global esconde o problema da classe rara.",
          ],
        },
        {
          id: "ch04-cm-p2",
          prompt: r`<p>(a) Com $p=10$ preditores e $K=3$ classes, quantos parâmetros de covariância a LDA estima? E a QDA? (b) Qual seria mais arriscada com 60 observações no total, e por quê? (c) O que o Naive Bayes assume que reduz ainda mais o número de parâmetros?</p>`,
          hints: [r`Uma matriz de covariância $p\times p$ simétrica tem $p(p+1)/2$ parâmetros.`],
          solution: r`<p>(a) $p(p+1)/2=55$. LDA: $55$. QDA: $3\times55=165$.<br>(b) QDA: 165 parâmetros para 60 observações é variância muito alta (overfitting).<br>(c) Independência dos preditores dentro de cada classe: estima-se uma densidade <i>univariada</i> por preditor e classe, sem covariâncias.</p>`,
          rubric: [
            "55 e 165.",
            "Apontei a QDA como mais arriscada por variância alta com poucos dados.",
            "Naive Bayes: preditores independentes dentro da classe.",
          ],
        },
      ],
      cards: [
        {
          id: "ch04-qda-c1",
          q: "Diferença entre LDA e QDA.",
          a: r`LDA: mesma covariância $\boldsymbol\Sigma$ em todas as classes → fronteira linear. QDA: $\boldsymbol\Sigma_k$ por classe → fronteira quadrática, mais flexível e com mais parâmetros.`,
        },
        {
          id: "ch04-qda-c2",
          q: "Defina sensibilidade e especificidade.",
          a: "Sensibilidade: fração dos positivos reais classificados como positivos (VP/(VP+FN)). Especificidade: fração dos negativos reais classificados como negativos (VN/(VN+FP)).",
        },
        {
          id: "ch04-qda-c3",
          q: "Qual a suposição do Naive Bayes?",
          a: "Dentro de cada classe, os preditores são independentes, então $f_k(x)=\\prod_j f_{kj}(x_j)$.",
        },
        {
          id: "ch04-qda-c4",
          q: "O que acontece com sensibilidade e especificidade ao baixar o limiar de decisão?",
          a: "A sensibilidade sobe (menos falsos negativos) e a especificidade cai (mais falsos positivos). A ROC mostra essa troca.",
        },
      ],
      deepDive: r`As Tabelas 4.4 a 4.6 (pp. 152–156) mostram as matrizes de confusão da LDA nos dados Default e o efeito de mudar o limiar de 0,5 para 0,2. A Figura 4.8 (p. 155) mostra a curva ROC.`,
    },

    {
      id: "ch04-comparar-glm",
      title: "Qual classificador usar, e modelos lineares generalizados",
      minutes: 12,
      book: "Seções 4.5–4.6, pp. 161–173",
      hook: "Nenhum método vence sempre. Saber quando cada um brilha é a habilidade.",
      blocks: [
        {
          kind: "key",
          title: "Mapa de escolha",
          body: r`<p>• <b>Logística e LDA</b>: fronteiras lineares; costumam ir bem quando a verdade é quase linear (LDA ainda melhor se os dados são normais).<br>• <b>QDA</b>: meio-termo, fronteira quadrática.<br>• <b>KNN</b>: não paramétrico; vence com fronteiras bem não lineares e muitos dados, mas exige escolher $K$.<br>• <b>Naive Bayes</b>: útil quando $p$ é grande ou $n$ é pequeno.</p>`,
          margin:
            "O livro resume (Seção 4.5.2) cenários simulados em que cada método ganha, de acordo com a forma real da fronteira.",
        },
        {
          kind: "text",
          title: "Modelos lineares generalizados (GLM)",
          body: r`<p>Regressão linear e logística são casos de uma família: GLM. Eles escolhem uma distribuição para $Y$ e uma <b>função de ligação</b> que torna a média linear nos preditores. Para <b>contagens</b> (ex.: bicicletas alugadas por hora, dados Bikeshare), usa-se a <b>regressão de Poisson</b>:</p>$$\log\lambda(X)=\beta_0+\beta_1X_1+\dots+\beta_pX_p,$$<p>com $Y\sim\text{Poisson}(\lambda)$, em que média e variância valem ambas $\lambda$.</p>`,
        },
        {
          kind: "warn",
          title: "Por que não regressão linear para contagens?",
          body: r`<p>Contagens são não negativas e a variância cresce com a média. A regressão linear pode prever valores negativos e supõe variância constante. A ligação log do Poisson garante $\lambda>0$.</p>`,
        },
      ],
      paper: [
        {
          id: "ch04-glm-p1",
          prompt: r`<p>Modelo de Poisson: $\log\lambda=1+0{,}5x$. (a) Qual o $\lambda$ esperado em $x=2$? (b) Por quanto se multiplica $\lambda$ quando $x$ sobe 1? (c) Por que isso difere de um modelo linear $\lambda=1+0{,}5x$?</p>`,
          hints: [r`$\lambda=e^{\log\lambda}$.`],
          solution: r`<p>(a) $\log\lambda=2\Rightarrow\lambda=e^2\approx7{,}39$.<br>(b) $e^{0{,}5}\approx1{,}65$: $\lambda$ cresce 65% por unidade de $x$, um efeito <b>multiplicativo</b>.<br>(c) O modelo linear soma $0{,}5$ por unidade e poderia dar valores negativos; o log garante $\lambda>0$ e permite que o efeito absoluto cresça com a média.</p>`,
          rubric: [
            "$\\lambda\\approx7{,}39$.",
            "Fator multiplicativo $e^{0{,}5}\\approx1{,}65$.",
            "Expliquei positividade e efeito multiplicativo.",
          ],
        },
      ],
      cards: [
        {
          id: "ch04-glm-c1",
          q: "Quando LDA, QDA, KNN ou logística tendem a ganhar?",
          a: "Fronteira linear: logística/LDA. Quadrática: QDA. Muito não linear com muitos dados: KNN. Naive Bayes: $p$ grande ou $n$ pequeno.",
        },
        {
          id: "ch04-glm-c2",
          q: "Forma da regressão de Poisson e quando usá-la.",
          a: r`$\log\lambda=\beta_0+\sum\beta_jX_j$; para respostas que são contagens (média = variância = $\lambda$).`,
        },
      ],
      deepDive: r`O estudo empírico da Seção 4.5.2 (pp. 164–166) compara os métodos em seis cenários simulados, e a Seção 4.6.2 (pp. 169–172) ajusta Poisson aos dados de bicicletas. O laboratório Python está nas pp. 173–192.`,
    },
  ],
};
export default ch;

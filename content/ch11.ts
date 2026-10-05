import type { Chapter } from "@/lib/types";
const r = String.raw;

const ch: Chapter = {
  id: "ch11",
  num: 11,
  title: "Análise de sobrevivência",
  pages: "pp. 469–501",
  blurb: "Dados censurados, curva de Kaplan–Meier, teste log-rank e o modelo de Cox.",
  lessons: [
    {
      id: "ch11-km",
      title: "Censura e a curva de Kaplan–Meier",
      minutes: 14,
      book: "Seções 11.1–11.3, pp. 470–474",
      hook: "Metade dos pacientes ainda está viva quando o estudo acaba. O que fazer com eles?",
      predict: {
        q: "Em um estudo, alguns pacientes ainda estão vivos no fim do seguimento. Descartá-los e analisar só quem morreu leva a…",
        options: [
          "Uma estimativa sem viés",
          "Uma sobrevida subestimada (viés)",
          "Uma sobrevida superestimada, mas só um pouco",
        ],
        answer: 1,
        why: r`Quem fica vivo é, justamente, quem sobrevive mais. Descartá-los deixa só os tempos curtos e <b>subestima</b> a sobrevida. A análise de sobrevivência usa a informação parcial desses pacientes.`,
      },
      blocks: [
        {
          kind: "key",
          title: "Censura à direita",
          body: r`<p>Para cada indivíduo há o tempo verdadeiro de evento $T$ e o de censura $C$. Observamos $Y=\min(T,C)$ e o indicador $\delta=1$ se $T\le C$ (evento) ou $0$ (censurado). Uma observação censurada diz só que $T>Y$. A suposição essencial é a <b>censura independente</b> do tempo de evento, dados os preditores.</p>`,
        },
        {
          kind: "key",
          title: "Função de sobrevivência",
          body: r`$$S(t)=\Pr(T>t),$$<p>a probabilidade de sobreviver além de $t$. Decresce de 1 para 0.</p>`,
        },
        {
          kind: "key",
          title: "Kaplan–Meier",
          body: r`<p>Sejam $d_1<\dots<d_K$ os tempos distintos de evento, $r_k$ os indivíduos <b>em risco</b> em $d_k$ e $q_k$ os eventos em $d_k$. Então</p>$$\hat S(d_k)=\prod_{j=1}^k\Big(1-\frac{q_j}{r_j}\Big).$$<p>É uma função em escada que cai a cada evento. Censurados entram nos $r_j$ até serem censurados e depois saem.</p>`,
        },
      ],
      paper: [
        {
          id: "ch11-km-p1",
          prompt: r`<p>Cinco pacientes: tempos (meses) e status ($1$ evento, $0$ censurado): $(3,1),\,(5,0),\,(6,1),\,(8,1),\,(10,0)$. (a) Construa a tabela $d_k$, $r_k$, $q_k$. (b) Calcule $\hat S$ em cada tempo de evento. (c) Qual a sobrevida estimada em 7 meses?</p>`,
          hints: [r`Em $t=6$, estão em risco quem tem tempo $\ge6$: $6,8,10$.`],
          solution: r`<p>$t=3$: $r=5$, $q=1$, fator $4/5=0{,}8$, $\hat S=0{,}8$.<br>$t=5$: censura, nada muda (mas o paciente sai do risco).<br>$t=6$: $r=3$, $q=1$, fator $2/3$; $\hat S=0{,}8\cdot2/3=0{,}533$.<br>$t=8$: $r=2$, $q=1$, fator $1/2$; $\hat S=0{,}267$.<br>$t=10$: censura.<br>(c) $\hat S(7)=\hat S(6)=0{,}533$ (função em escada).</p>`,
          rubric: [
            "Tabela com $r=5,3,2$ e $q=1,1,1$.",
            "$\\hat S=0{,}8;\\,0{,}533;\\,0{,}267$.",
            "$\\hat S(7)=0{,}533$.",
            "Tratei a censura em $t=5$ corretamente (sem queda, mas sai do risco).",
          ],
        },
      ],
      cards: [
        {
          id: "ch11-km-c1",
          q: "O que é censura à direita e como se registra?",
          a: r`Só sabemos que $T>Y$. Registra-se $Y=\min(T,C)$ e $\delta=I(T\le C)$.`,
        },
        {
          id: "ch11-km-c2",
          q: "Fórmula de Kaplan–Meier.",
          a: r`$\hat S(d_k)=\prod_{j\le k}(1-q_j/r_j)$, com $r_j$ em risco e $q_j$ eventos em $d_j$.`,
        },
        {
          id: "ch11-km-c3",
          q: "Por que descartar os censurados é um erro?",
          a: "Eles tendem a ser os que sobrevivem mais; descartá-los subestima a sobrevida. Kaplan–Meier usa a informação parcial deles.",
        },
      ],
      deepDive: r`A Seção 11.2 (p. 470) discute tipos de censura (à esquerda, intervalar) e o que acontece quando a censura depende do evento, o que quebra a análise. A Seção 11.4 (p. 474) compara curvas de KM entre grupos com o teste log-rank.`,
    },

    {
      id: "ch11-cox",
      title: "Log-rank, taxa de risco e o modelo de Cox",
      minutes: 16,
      book: "Seções 11.4–11.5, pp. 474–484",
      hook: "Como comparar grupos e medir o efeito de preditores sem supor uma forma para o tempo?",
      blocks: [
        {
          kind: "key",
          title: "Teste log-rank",
          body: r`<p>Testa se duas curvas de sobrevivência diferem. A cada tempo de evento $d_k$, calcule as mortes esperadas no grupo 1 supondo hipótese nula: $\ E_{1k}=q_k\cdot\frac{r_{1k}}{r_{1k}+r_{2k}}$. Compare os observados $O_1=\sum q_{1k}$ com $E_1=\sum E_{1k}$: a estatística é grande quando $O_1-E_1$ é grande em relação à sua variância.</p>`,
        },
        {
          kind: "key",
          title: "Função de risco (hazard)",
          body: r`$$h(t)=\lim_{\Delta t\to0}\frac{\Pr(t<T\le t+\Delta t\mid T>t)}{\Delta t}.$$<p>É o risco instantâneo de evento em $t$ para quem sobreviveu até $t$. Relaciona-se com $S(t)=\exp\big(-\int_0^th(u)\,du\big)$.</p>`,
        },
        {
          kind: "key",
          title: "Riscos proporcionais de Cox",
          body: r`$$h(t\mid x_i)=h_0(t)\exp\Big(\sum_{j=1}^p\beta_jx_{ij}\Big).$$<p>$h_0(t)$ é o risco-base, <b>não especificado</b>: não supomos forma para ele. Os $\beta_j$ se estimam pela <b>verossimilhança parcial</b>. O fator $e^{\beta_j}$ é a <b>razão de riscos</b> por unidade de $x_j$, constante no tempo (daí “proporcionais”).</p>`,
        },
        {
          kind: "warn",
          title: "Cuidado",
          body: r`<p>A suposição de proporcionalidade (a razão de riscos não muda com $t$) deve ser checada. Ela pode falhar, por exemplo se o efeito de um tratamento some com o tempo.</p>`,
        },
      ],
      paper: [
        {
          id: "ch11-cox-p1",
          prompt: r`<p>(a) Em dois tempos de evento temos $(r_1,r_2,q)=(10,10,2)$ e $(8,9,1)$. Calcule $E_1$. (b) Se o grupo 1 teve $O_1=3$ eventos, qual é $O_1-E_1$? (c) No modelo de Cox, $\hat\beta=0{,}693$ para o tratamento ($x=1$ tratado, $0$ controle). Qual a razão de riscos e o que significa? (d) E para $\hat\beta=-0{,}357$?</p>`,
          hints: [r`$E_{1k}=q_k\,r_{1k}/(r_{1k}+r_{2k})$. HR $=e^{\hat\beta}$.`],
          solution: r`<p>(a) $E_{11}=2\cdot10/20=1$; $E_{12}=1\cdot8/17\approx0{,}471$. $E_1\approx1{,}471$.<br>(b) $O_1-E_1=3-1{,}471=1{,}529$: o grupo 1 teve mais eventos que o esperado sob $H_0$.<br>(c) $e^{0{,}693}\approx2{,}0$: o tratamento dobra o risco instantâneo em qualquer instante.<br>(d) $e^{-0{,}357}\approx0{,}70$: reduz o risco em cerca de 30%.</p>`,
          rubric: [
            "$E_1\\approx1{,}471$.",
            "$O_1-E_1\\approx1{,}53$ e interpretação.",
            "HR $\\approx2{,}0$ e seu significado.",
            "HR $\\approx0{,}70$ (redução de ~30%).",
          ],
        },
      ],
      cards: [
        {
          id: "ch11-cox-c1",
          q: "Ideia do teste log-rank.",
          a: "Compara eventos observados e esperados (sob $H_0$) no grupo 1 a cada tempo de evento; estatística grande se a diferença é grande frente à variância.",
        },
        {
          id: "ch11-cox-c2",
          q: "Defina a função de risco $h(t)$ e a forma do modelo de Cox.",
          a: r`$h(t)$: risco instantâneo de evento em $t$ dado que sobreviveu até $t$. Cox: $h(t|x)=h_0(t)\exp(\sum\beta_jx_j)$, com $h_0$ não especificado.`,
        },
        {
          id: "ch11-cox-c3",
          q: r`Como interpretar $e^{\beta_j}$ no modelo de Cox?`,
          a: r`Razão de riscos por unidade de $x_j$, constante no tempo (proporcionalidade).`,
        },
      ],
      deepDive: r`A Seção 11.5.3 (p. 482) aplica Cox aos dados de câncer cerebral (tipo de tumor, sexo, Karnofsky), e a Seção 11.7.4 (p. 488) mostra como checar proporcionalidade. A Seção 11.6 (p. 484) trata de Cox com penalidade (lasso).`,
    },
  ],
};
export default ch;

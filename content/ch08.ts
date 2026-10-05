import type { Chapter } from "@/lib/types";
const r = String.raw;

const ch: Chapter = {
  id: "ch08",
  num: 8,
  title: "Métodos baseados em árvores",
  pages: "pp. 331–365",
  blurb: "Árvores de decisão, bagging, florestas aleatórias e boosting.",
  lessons: [
    {
      id: "ch08-arvores",
      title: "Árvores de regressão e de classificação",
      minutes: 16,
      book: "Seção 8.1, pp. 331–343",
      hook: "Perguntas de sim ou não, em cascata, dividem o espaço em caixas.",
      blocks: [
        {
          kind: "key",
          title: "Árvore de regressão",
          body: r`<p>Divide o espaço dos preditores em regiões $R_1,\dots,R_J$ e prevê, em cada região, a <b>média das respostas</b> de treino. As regiões vêm de <b>divisões binárias recursivas</b>: a cada passo escolhe-se o preditor $X_j$ e o corte $s$ que minimizam</p>$$\sum_{i:x_i\in R_1}(y_i-\hat y_{R_1})^2+\sum_{i:x_i\in R_2}(y_i-\hat y_{R_2})^2.$$<p>É um método <b>guloso</b>: escolhe a melhor divisão agora, sem olhar adiante.</p>`,
        },
        {
          kind: "text",
          title: "Podar a árvore",
          body: r`<p>Uma árvore grande se ajusta demais (variância alta). A <b>poda por custo-complexidade</b> minimiza $\sum_m\sum_{x_i\in R_m}(y_i-\hat y_{R_m})^2+\alpha|T|$, onde $|T|$ é o número de folhas. $\alpha$ se escolhe por validação cruzada.</p>`,
        },
        {
          kind: "key",
          title: "Árvore de classificação",
          body: r`<p>Prevê a <b>classe mais comum</b> na região. Para escolher divisões, o erro de classificação é pouco sensível; usa-se o <b>índice de Gini</b> ou a <b>entropia</b>, que medem a <b>pureza</b> do nó, com $\hat p_{mk}$ a proporção da classe $k$ no nó $m$:</p>$$G_m=\sum_k\hat p_{mk}(1-\hat p_{mk}),\qquad D_m=-\sum_k\hat p_{mk}\log\hat p_{mk}.$$<p>Valores pequenos indicam nós puros.</p>`,
        },
        {
          kind: "text",
          title: "Prós e contras",
          body: r`<p><b>Prós:</b> fáceis de explicar e desenhar, tratam preditores qualitativos sem dummies. <b>Contras:</b> em geral <b>menos precisas</b> que outros métodos e <b>instáveis</b>: pequenas mudanças nos dados mudam muito a árvore. Os métodos da próxima lição corrigem isso.</p>`,
        },
      ],
      paper: [
        {
          id: "ch08-tree-p1",
          prompt: r`<p>Dados: $x=(1,2,3,4,5,6)$, $y=(1,1,2,8,9,9)$. Considere os cortes em $2{,}5$, $3{,}5$ e $4{,}5$. (a) Calcule o RSS total de cada corte (soma dos dois lados). (b) Qual a melhor primeira divisão? (c) Quais as previsões das duas regiões?</p>`,
          hints: [
            r`Corte em $3{,}5$: $R_1=\{1,1,2\}$ e $R_2=\{8,9,9\}$. RSS de cada região: soma de $(y-\bar y)^2$.`,
          ],
          solution: r`<p>Corte $2{,}5$: $R_1=\{1,1\}$ (RSS 0), $R_2=\{2,8,9,9\}$ com média 7: $25+1+4+4=34$. Total $34$.<br>Corte $3{,}5$: $R_1$ média $4/3$: $(1/9+1/9+4/9)=0{,}667$; $R_2$ média $26/3$: $(4/9+1/9+1/9)=0{,}667$. Total $\approx1{,}333$.<br>Corte $4{,}5$: $R_1=\{1,1,2,8\}$ média 3: $4+4+1+25=34$; $R_2=\{9,9\}$: 0. Total $34$.</p><p>Melhor: <b>$x<3{,}5$</b>. Previsões: $4/3\approx1{,}33$ e $26/3\approx8{,}67$.</p>`,
          rubric: [
            "RSS: 34; 1,333; 34.",
            "Melhor corte em 3,5.",
            "Previsões 1,33 e 8,67 (médias das regiões).",
          ],
        },
        {
          id: "ch08-tree-p2",
          prompt: r`<p>Um nó tem 8 observações: 6 da classe A e 2 da classe B. Calcule o erro de classificação do nó, o índice de Gini e a entropia (log natural). Depois compare com um nó puro (8 de A).</p>`,
          hints: [r`$\hat p=(0{,}75;\,0{,}25)$.`],
          solution: r`<p>Erro $=1-0{,}75=0{,}25$.<br>Gini $=0{,}75\cdot0{,}25+0{,}25\cdot0{,}75=0{,}375$.<br>Entropia $=-(0{,}75\ln0{,}75+0{,}25\ln0{,}25)=0{,}216+0{,}347\approx0{,}562$.<br>Nó puro: erro 0, Gini 0 e entropia 0. Gini e entropia são mais sensíveis à pureza que o erro e por isso orientam melhor as divisões.</p>`,
          rubric: [
            "Erro 0,25.",
            "Gini 0,375.",
            "Entropia $\\approx0{,}562$.",
            "Nó puro dá zero nas três.",
          ],
        },
      ],
      spot: {
        intro: r`<p>Rita defende o uso de uma única árvore grande. <b>Onde o raciocínio falha?</b></p>`,
        steps: [
          "A árvore é fácil de interpretar e de desenhar.",
          "Uma árvore bem profunda ajusta quase perfeitamente os dados de treino.",
          "Portanto ela terá também o menor erro de teste.",
          "Podar a árvore por custo-complexidade controla esse problema.",
        ],
        wrong: 2,
        why: r`Ajuste quase perfeito no treino indica <b>variância alta</b> e overfitting. O erro de teste costuma ser pior, e é por isso que se poda (passo 4).`,
      },
      cards: [
        {
          id: "ch08-tree-c1",
          q: "Como uma árvore de regressão prevê e como escolhe divisões?",
          a: "Prevê a média de $y$ na região. Escolhe, de forma gulosa, o preditor e o corte que minimizam o RSS somado das duas regiões.",
        },
        {
          id: "ch08-tree-c2",
          q: "Defina Gini e entropia de um nó.",
          a: r`$G=\sum\hat p_k(1-\hat p_k)$ e $D=-\sum\hat p_k\log\hat p_k$. Pequenos quando o nó é puro.`,
        },
        {
          id: "ch08-tree-c3",
          q: "Por que podar a árvore?",
          a: "Uma árvore grande tem variância alta e overfitting. A poda por custo-complexidade ($\\alpha$ por CV) reduz a árvore e melhora o erro de teste.",
        },
      ],
      deepDive: r`As páginas 341–342 comparam árvores com modelos lineares (a fronteira em caixas versus em reta) e listam vantagens e desvantagens, com o exemplo gráfico da Fig. 8.7.`,
    },

    {
      id: "ch08-ensembles",
      title: "Bagging, florestas aleatórias e boosting",
      minutes: 16,
      book: "Seção 8.2, pp. 343–353",
      hook: "Uma árvore é instável. Mil árvores votando são uma outra história.",
      predict: {
        q: "Ao tirar a média de $B$ observações independentes, cada uma com variância $\\sigma^2$, a variância da média é…",
        options: [r`$\sigma^2$`, r`$\sigma^2/B$`, r`$\sigma^2\cdot B$`],
        answer: 1,
        why: r`A média de $B$ variáveis independentes tem variância $\sigma^2/B$. É a ideia por trás do bagging: promediar muitos modelos de alta variância.`,
      },
      blocks: [
        {
          kind: "key",
          title: "Bagging",
          body: r`<p>Gere $B$ amostras bootstrap, ajuste uma árvore profunda em cada uma e <b>promedie</b> as previsões (ou vote, em classificação). Reduz a variância sem aumentar muito o viés. Cada árvore usa cerca de dois terços das observações; as demais (<b>out-of-bag</b>, ~1/3) servem de teste: o <b>erro OOB</b> estima o erro de teste sem validação cruzada.</p>`,
        },
        {
          kind: "key",
          title: "Florestas aleatórias",
          body: r`<p>Bagging mais um truque: a cada divisão, a árvore só pode escolher entre <b>$m$ preditores sorteados</b> (tipicamente $m\approx\sqrt p$). Isso <b>descorrelaciona</b> as árvores: sem isso, um preditor muito forte aparece no topo de todas elas e as árvores ficam parecidas, e promediar árvores muito correlacionadas reduz pouco a variância.</p>`,
        },
        {
          kind: "key",
          title: "Boosting",
          body: r`<p>As árvores são ajustadas <b>em sequência</b>, cada uma aos <b>resíduos</b> do modelo atual. Começa-se com $\hat f=0$, $r_i=y_i$. Para $b=1,\dots,B$: ajuste uma árvore pequena $\hat f^b$ aos $(x_i,r_i)$; atualize $\hat f\leftarrow\hat f+\lambda\hat f^b$ e $r_i\leftarrow r_i-\lambda\hat f^b(x_i)$. Parâmetros: $B$ (nº de árvores), $\lambda$ (taxa de aprendizado, p. ex. 0,01) e $d$ (tamanho de cada árvore).</p>`,
          margin:
            "Bagging e floresta reduzem variância. Boosting aprende devagar, reduzindo viés aos poucos. $B$ muito grande no boosting pode causar overfitting.",
        },
        {
          kind: "text",
          title: "BART",
          body: r`<p>Árvores aditivas bayesianas (BART) usam árvores perturbadas aleatoriamente ao longo de muitas iterações, combinando ideias de boosting (ajustar resíduos) e floresta (aleatoriedade). A Seção 8.2.4 (p. 350) detalha o algoritmo.</p>`,
        },
      ],
      paper: [
        {
          id: "ch08-ens-p1",
          prompt: r`<p>Cada árvore tem variância $\sigma^2=4$ em um ponto. (a) Se as $B=100$ árvores fossem independentes, qual a variância da média? (b) Se tiverem correlação par a par $\rho=0{,}5$, a variância da média é $\rho\sigma^2+\frac{1-\rho}{B}\sigma^2$. Calcule. (c) O que isso ensina sobre florestas aleatórias?</p>`,
          hints: [r`(b) $0{,}5\cdot4+0{,}5\cdot4/100$.`],
          solution: r`<p>(a) $4/100=0{,}04$.<br>(b) $0{,}5\cdot4+\frac{0{,}5}{100}\cdot4=2+0{,}02=2{,}02$.<br>(c) Com árvores correlacionadas, aumentar $B$ não ajuda além de $\rho\sigma^2$: a variância trava em 2. Reduzir a correlação ($m$ preditores por divisão) baixa esse piso, que é exatamente o objetivo da floresta aleatória.</p>`,
          rubric: [
            "(a) 0,04.",
            "(b) 2,02.",
            "Percebi que $\\rho\\sigma^2$ é o piso e que a floresta atua reduzindo $\\rho$.",
          ],
        },
        {
          id: "ch08-ens-p2",
          prompt: r`<p>Boosting à mão. $y=(10,12)$, começo $\hat f=0$, $r=y$, $\lambda=0{,}1$. A 1ª árvore prevê a média dos resíduos para ambos: $\hat f^1=(11,11)$. (a) Atualize $\hat f$ e $r$. (b) A 2ª árvore prevê a média dos novos resíduos; atualize de novo. (c) Para onde convergem as previsões se continuarmos, e por que $\lambda$ pequeno exige $B$ grande?</p>`,
          hints: [r`$\hat f\leftarrow\hat f+\lambda\hat f^b$; $r\leftarrow r-\lambda\hat f^b$.`],
          solution: r`<p>(a) $\hat f=0+0{,}1\cdot(11,11)=(1{,}1;1{,}1)$; $r=(10-1{,}1;\ 12-1{,}1)=(8{,}9;\ 10{,}9)$.<br>(b) Média dos resíduos $=9{,}9$; $\hat f=(1{,}1+0{,}99;\ \dots)=(2{,}09;\ 2{,}09)$; $r=(8{,}9-0{,}99;\ 10{,}9-0{,}99)=(7{,}91;\ 9{,}91)$.<br>(c) Cada passo reduz o resíduo médio em 10%: as previsões se aproximam do que a árvore consegue captar (aqui, a média 11, pois a árvore é constante). Com $\lambda$ pequeno cada passo corrige pouco, então precisa-se de muitas árvores ($B$ grande).</p>`,
          rubric: [
            "$\\hat f=1{,}1$ e $r=(8{,}9;\\,10{,}9)$.",
            "Segundo passo: $\\hat f=2{,}09$, $r=(7{,}91;\\,9{,}91)$.",
            "Entendi o papel de $\\lambda$ e de $B$.",
          ],
        },
      ],
      cards: [
        {
          id: "ch08-ens-c1",
          q: "O que é o erro OOB e por que ele existe?",
          a: "Cada árvore bootstrap deixa ~1/3 das observações de fora. Prever essas observações só com as árvores que não as viram dá uma estimativa do erro de teste sem CV.",
        },
        {
          id: "ch08-ens-c2",
          q: "Qual o truque da floresta aleatória sobre o bagging?",
          a: r`A cada divisão considera só $m\approx\sqrt p$ preditores sorteados, descorrelacionando as árvores e reduzindo mais a variância da média.`,
        },
        {
          id: "ch08-ens-c3",
          q: "Como o boosting funciona e quais seus 3 parâmetros?",
          a: r`Árvores pequenas ajustadas em sequência aos resíduos, somando $\lambda\hat f^b$. Parâmetros: $B$ (árvores), $\lambda$ (taxa de aprendizado), $d$ (tamanho da árvore).`,
        },
      ],
      deepDive: r`A Figura 8.8 (p. 344) mostra o erro de bagging contra o número de árvores, com o erro OOB. O resumo comparativo da Seção 8.2.5 (p. 353) coloca bagging, floresta, boosting e BART lado a lado.`,
    },
  ],
};
export default ch;

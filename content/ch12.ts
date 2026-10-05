import type { Chapter } from "@/lib/types";
const r = String.raw;

const ch: Chapter = {
  id: "ch12",
  num: 12,
  title: "Aprendizado não supervisionado",
  pages: "pp. 503–555",
  blurb: "Componentes principais, K-médias e agrupamento hierárquico.",
  lessons: [
    {
      id: "ch12-pca",
      title: "Análise de componentes principais",
      minutes: 16,
      book: "Seção 12.2, pp. 504–515",
      hook: "Sem resposta para prever, como resumir 50 variáveis em duas?",
      blocks: [
        {
          kind: "key",
          title: "A primeira componente",
          body: r`<p>Com variáveis centradas, a <b>primeira componente principal</b> é a combinação linear normalizada</p>$$Z_1=\phi_{11}X_1+\phi_{21}X_2+\dots+\phi_{p1}X_p,\qquad \sum_j\phi_{j1}^2=1,$$<p>com a <b>maior variância amostral</b> possível. Os $\phi_{j1}$ são as <b>cargas</b> (<i>loadings</i>). A segunda componente maximiza a variância entre as combinações <b>não correlacionadas</b> com a primeira (ortogonais), e assim por diante.</p>`,
        },
        {
          kind: "text",
          title: "Duas interpretações",
          body: r`<p>(1) A direção ao longo da qual os dados <b>mais variam</b>. (2) O hiperplano de dimensão $M$ <b>mais próximo</b> das observações (menor distância quadrática). As duas coincidem.</p>`,
        },
        {
          kind: "key",
          title: "Proporção de variância explicada",
          body: r`$$\text{PVE}_m=\frac{\text{variância de }Z_m}{\sum_{j=1}^p\text{Var}(X_j)}.$$<p>A soma de todas as PVE é 1. O <b>gráfico de cotovelo</b> (<i>scree plot</i>) ajuda a escolher quantas componentes manter: procura-se o ponto onde o ganho de PVE cai.</p>`,
        },
        {
          kind: "warn",
          title: "Escala e sinal",
          body: r`<p>Se as variáveis têm escalas diferentes, <b>padronize</b> antes (senão a de maior variância domina). Cada componente é única só <b>a menos do sinal</b>: $\phi$ e $-\phi$ descrevem a mesma direção.</p>`,
        },
      ],
      paper: [
        {
          id: "ch12-pca-p1",
          prompt: r`<p>Duas variáveis centradas com matriz de covariância $\begin{pmatrix}4&2\\2&3\end{pmatrix}$. As variâncias das componentes são os autovalores. (a) Ache os autovalores: $\lambda^2-(\text{traço})\lambda+\det=0$. (b) Calcule PVE$_1$ e PVE$_2$. (c) Ache a carga da 1ª componente: resolva $(4-\lambda_1)\phi_1+2\phi_2=0$ e normalize.</p>`,
          hints: [
            r`Traço $=7$, determinante $=4\cdot3-2\cdot2=8$. $\lambda=\frac{7\pm\sqrt{49-32}}{2}$.`,
          ],
          solution: r`<p>(a) $\lambda=\dfrac{7\pm\sqrt{17}}{2}$: $\lambda_1\approx5{,}562$, $\lambda_2\approx1{,}438$.<br>(b) Variância total $=7$. PVE$_1=5{,}562/7\approx0{,}795$; PVE$_2\approx0{,}205$. A 1ª componente explica quase 80%.<br>(c) $(4-5{,}562)\phi_1+2\phi_2=0\Rightarrow\phi_2=0{,}781\phi_1$. Normalizando: $\phi_1=1/\sqrt{1+0{,}781^2}\approx0{,}788$, $\phi_2\approx0{,}615$. Ambas positivas: a componente é uma “média” das duas variáveis.</p>`,
          rubric: [
            "Autovalores $\\approx5{,}56$ e $1{,}44$.",
            "PVE $\\approx0{,}795$ e $0{,}205$.",
            "Carga $(0{,}788;\\,0{,}615)$ normalizada.",
          ],
        },
      ],
      cards: [
        {
          id: "ch12-pca-c1",
          q: "Defina a primeira componente principal.",
          a: r`A combinação linear normalizada ($\sum\phi_{j1}^2=1$) das variáveis com maior variância amostral.`,
        },
        {
          id: "ch12-pca-c2",
          q: "O que é PVE e como escolher o número de componentes?",
          a: "Proporção da variância total explicada por cada componente (soma 1). Escolhe-se pelo gráfico de cotovelo, onde o ganho de PVE cai.",
        },
        {
          id: "ch12-pca-c3",
          q: "Duas precauções ao fazer PCA.",
          a: "Padronizar variáveis com escalas diferentes; lembrar que cada componente só é única a menos do sinal.",
        },
      ],
      deepDive: r`A Seção 12.2.4 (p. 512) trata de escalonamento, unicidade e decisão do número de componentes; a 12.3 (p. 515) usa PCA iterativo para completar valores ausentes (matrix completion).`,
    },

    {
      id: "ch12-clustering",
      title: "K-médias e agrupamento hierárquico",
      minutes: 16,
      book: "Seção 12.4, pp. 520–535",
      hook: "Achar grupos sem saber quantos existem nem o que os define.",
      blocks: [
        {
          kind: "key",
          title: "K-médias",
          body: r`<p>Escolha $K$. Particione as observações em $K$ grupos minimizando a variação <b>dentro</b> dos grupos (distância euclidiana ao centro). Algoritmo: (1) atribua cada observação a um grupo ao acaso; (2) repita até estabilizar: calcule o <b>centróide</b> (média) de cada grupo, e reatribua cada ponto ao centróide mais próximo.</p>`,
          margin:
            "O objetivo nunca aumenta a cada passo, então o algoritmo converge, mas a um mínimo local. Rode várias inicializações e fique com a melhor.",
        },
        {
          kind: "key",
          title: "Agrupamento hierárquico",
          body: r`<p>Não exige $K$ antecipado. Constrói um <b>dendrograma</b>: começa com cada ponto como grupo e funde repetidamente os dois grupos <b>mais próximos</b>. A altura da fusão mede a dissimilaridade. Cortar o dendrograma numa altura dá os grupos. A noção de “distância entre grupos” é a <b>ligação</b>: <b>completa</b> (maior distância entre pares), <b>simples</b> (menor), <b>média</b> e <b>centróide</b>. Completa e média produzem dendrogramas mais equilibrados.</p>`,
        },
        {
          kind: "warn",
          title: "Decisões que mudam o resultado",
          body: r`<p>Padronizar ou não as variáveis; escolher a medida de dissimilaridade (euclidiana ou de correlação); a ligação; onde cortar; quantos $K$. Não há resposta única, e o resultado deve ser visto como exploratório, avaliando se é <b>robusto</b> (por exemplo, repetindo em subconjuntos).</p>`,
        },
      ],
      paper: [
        {
          id: "ch12-km-p1",
          prompt: r`<p>Pontos: $A(1,1)$, $B(2,1)$, $C(4,3)$, $D(5,4)$. Centróides iniciais: $c_1=(1,1)$, $c_2=(5,4)$. Execute K-médias com $K=2$ à mão até convergir: atribuições, novos centróides, e confira se mudaram.</p>`,
          hints: [
            r`Passo 1: distâncias de cada ponto a $c_1$ e $c_2$. $B$: $d(c_1)=1$, $d(c_2)=\sqrt{18}$.`,
          ],
          solution: r`<p>Atribuição 1: $A\to c_1$; $B\to c_1$ ($1$ vs $4{,}24$); $C\to c_2$ ($3{,}61$ vs $1{,}41$); $D\to c_2$.<br>Novos centróides: $c_1=(1{,}5;\,1)$, $c_2=(4{,}5;\,3{,}5)$.<br>Atribuição 2: $B$: $0{,}5$ vs $3{,}54\to c_1$; $C$: $3{,}2$ vs $0{,}71\to c_2$. Nada muda: <b>convergiu</b>. Grupos $\{A,B\}$ e $\{C,D\}$.</p>`,
          rubric: [
            "Primeira atribuição correta.",
            "Centróides $(1{,}5;1)$ e $(4{,}5;3{,}5)$.",
            "Verifiquei que nada mudou na 2ª atribuição.",
          ],
        },
        {
          id: "ch12-hc-p1",
          prompt: r`<p>Pontos em 1D: $1,2,6,7,15$. Faça o agrupamento hierárquico com ligação <b>simples</b> e depois com <b>completa</b>. (a) Que fusões ocorrem e com que alturas? (b) Em que altura a ligação simples e a completa diferem?</p>`,
          hints: [r`Primeiras fusões: $\{1,2\}$ e $\{6,7\}$, ambas na altura 1.`],
          solution: r`<p>1ª e 2ª fusões: $\{1,2\}$ e $\{6,7\}$, altura $1$ (iguais nos dois métodos).<br>3ª fusão ($\{1,2\}$ com $\{6,7\}$): simples $=6-2=4$; completa $=7-1=6$.<br>4ª fusão (com o 15): simples $=15-7=8$; completa $=15-1=14$.<br>As alturas diferem a partir da 3ª fusão: a simples usa o par mais próximo, a completa o mais distante.</p>`,
          rubric: [
            "Fusões em altura 1 para ambos.",
            "3ª fusão: 4 (simples) e 6 (completa).",
            "4ª fusão: 8 e 14.",
          ],
        },
      ],
      cards: [
        {
          id: "ch12-cl-c1",
          q: "Algoritmo de K-médias em 3 passos.",
          a: "1) Atribua pontos a grupos ao acaso. 2) Calcule o centróide de cada grupo. 3) Reatribua cada ponto ao centróide mais próximo; repita 2–3 até estabilizar.",
        },
        {
          id: "ch12-cl-c2",
          q: "Por que rodar K-médias com várias inicializações?",
          a: "Converge a um mínimo local que depende da atribuição inicial; escolhe-se o resultado de menor variação total dentro dos grupos.",
        },
        {
          id: "ch12-cl-c3",
          q: "Descreva ligações simples, completa, média e centróide.",
          a: "Distância entre grupos: simples = menor distância entre pares; completa = maior; média = média de todas as distâncias; centróide = distância entre centróides.",
        },
      ],
      deepDive: r`A Seção 12.4.3 (p. 532) lista decisões práticas (padronização, dissimilaridade, ligação, onde cortar) e o cuidado de validar os grupos. O laboratório com os dados NCI60 está na Seção 12.5.4 (p. 546).`,
    },
  ],
};
export default ch;

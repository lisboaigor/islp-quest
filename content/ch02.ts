import type { Chapter } from "@/lib/types";
const r = String.raw;

const ch: Chapter = {
  id: "ch02",
  num: 2,
  title: "Aprendizado estatístico",
  pages: "pp. 15–39",
  blurb:
    "O vocabulário que sustenta o resto: estimar f, erro de teste, viés e variância, Bayes e KNN.",
  lessons: [
    /* ───────── 2.1.1 ───────── */
    {
      id: "ch02-estimar-f",
      title: "Por que estimar f: previsão, inferência e o erro que não some",
      minutes: 12,
      book: "Seção 2.1.1, pp. 15–20",
      hook: "Mesmo com o modelo perfeito, ainda erramos. Quanto, e por quê?",
      predict: {
        q: r`Suponha que você descobriu exatamente a função verdadeira $f$ que liga os preditores à resposta. Ao prever novos valores de $Y$, o erro de previsão será…`,
        options: [
          "Zero, porque o modelo é perfeito",
          r`Maior que zero, por causa de algo que $X$ não explica`,
          "Zero se tivermos dados suficientes",
        ],
        answer: 1,
        why: r`Existe o termo de erro $\varepsilon$, que não depende de $X$. Mesmo com $\hat f = f$, ele continua lá. É o <b>erro irredutível</b>.`,
      },
      blocks: [
        {
          kind: "text",
          title: "O cenário do livro",
          body: r`<p>Um cliente quer vender mais de um produto. Ele não controla as vendas, mas controla o orçamento de propaganda em TV, rádio e jornal. O conjunto <b>Advertising</b> traz as vendas em 200 mercados, com os três orçamentos de cada um.</p>
<p>Os orçamentos são as <b>entradas</b> $X_1, X_2, X_3$ (também chamadas de preditores, variáveis independentes ou <i>features</i>). As vendas são a <b>resposta</b> $Y$. Supomos que existe uma relação:</p>$$Y = f(X) + \varepsilon$$<p>$f$ é a parte sistemática, desconhecida. $\varepsilon$ é um erro aleatório, independente de $X$ e com média zero.</p>`,
          margin: "Todo o livro é sobre uma pergunta: como estimar esse $f$ a partir de dados?",
        },
        {
          kind: "key",
          title: "Dois motivos para estimar f",
          body: r`<p><b>Previsão.</b> Temos $X$ mas não conseguimos $Y$. Usamos $\hat Y = \hat f(X)$. Aqui $\hat f$ pode ser uma <b>caixa-preta</b>: só importa acertar.</p>
<p><b>Inferência.</b> Queremos entender <i>como</i> $Y$ depende de $X$: quais preditores importam, se a relação é positiva ou negativa, se é linear. Aqui $\hat f$ <b>não</b> pode ser caixa-preta, precisamos ver sua forma.</p>`,
          margin:
            "Muitos problemas reais misturam os dois. A escolha do método depende de qual pesa mais.",
        },
        {
          kind: "text",
          title: "Erro redutível e irredutível",
          body: r`<p>Nossa estimativa $\hat f$ nunca é perfeita. Esse desvio é o <b>erro redutível</b>: um método melhor pode diminuí-lo.</p>
<p>Mas $Y$ também depende de $\varepsilon$, e $\varepsilon$ não pode ser previsto com $X$. É o <b>erro irredutível</b>. Com $X$ e $\hat f$ fixos:</p>$$E\big(Y-\hat Y\big)^2 = \underbrace{\big[f(X)-\hat f(X)\big]^2}_{\text{redutível}} + \underbrace{\operatorname{Var}(\varepsilon)}_{\text{irredutível}}$$`,
        },
        {
          kind: "analogy",
          title: "Uma imagem",
          body: r`<p>Você sabe exatamente o trânsito de todas as ruas ($f$ perfeita) e ainda assim o tempo de viagem varia: um ciclista cruza, o sinal demora. Esse resto é $\varepsilon$. Nenhum aplicativo melhor remove isso.</p>`,
        },
        {
          kind: "warn",
          title: "Cuidado",
          body: r`<p>O erro irredutível é um <b>piso</b> para a qualidade da previsão, e na prática é quase sempre desconhecido. Não dá para saber se “já chegamos no limite” só olhando o erro.</p>`,
        },
        {
          kind: "deep",
          title: "Toca do coelho: de onde vem ε",
          body: r`<p>O livro dá duas fontes: variáveis <b>não medidas</b> que ajudariam a prever $Y$ (se não as medimos, $f$ não pode usá-las) e variação <b>inerente</b> ao fenômeno (o risco de reação a um remédio varia de um dia para o outro com a fabricação ou o bem-estar do paciente).</p>`,
        },
      ],
      paper: [
        {
          id: "ch02-estimar-f-p1",
          prompt: r`<p>Com $X$ e $\hat f$ fixos, $Y = f(X)+\varepsilon$, $E(\varepsilon)=0$. <b>Demonstre no caderno</b> que</p>$$E(Y-\hat Y)^2=[f(X)-\hat f(X)]^2+\operatorname{Var}(\varepsilon).$$<p>Dica de método: escreva $Y-\hat Y$ já substituindo $Y$ e $\hat Y$.</p>`,
          hints: [
            r`$Y-\hat Y = f(X)+\varepsilon-\hat f(X) = [f(X)-\hat f(X)]+\varepsilon$.`,
            r`Eleve ao quadrado como $(a+b)^2$, com $a=f-\hat f$ (fixo) e $b=\varepsilon$ (aleatório).`,
            r`Tire a esperança termo a termo. Quem é fixo sai da esperança. Quanto vale $E(\varepsilon)$? E $E(\varepsilon^2)$, sabendo que a média é zero?`,
          ],
          solution: r`<p>$Y-\hat Y=[f-\hat f]+\varepsilon$. Elevando ao quadrado:</p>$$(Y-\hat Y)^2=[f-\hat f]^2+2[f-\hat f]\varepsilon+\varepsilon^2.$$<p>Como $f-\hat f$ é fixo, só $\varepsilon$ é aleatório:</p>$$E(Y-\hat Y)^2=[f-\hat f]^2+2[f-\hat f]\underbrace{E(\varepsilon)}_{0}+E(\varepsilon^2).$$<p>Com média zero, $E(\varepsilon^2)=\operatorname{Var}(\varepsilon)$. Logo $E(Y-\hat Y)^2=[f-\hat f]^2+\operatorname{Var}(\varepsilon)$. ∎</p>`,
          rubric: [
            r`Escrevi $Y-\hat Y=[f-\hat f]+\varepsilon$ antes de elevar ao quadrado.`,
            r`Expandi o quadrado e identifiquei o termo cruzado $2[f-\hat f]\varepsilon$.`,
            r`Vi que o termo cruzado some porque $E(\varepsilon)=0$ e $f-\hat f$ é fixo.`,
            r`Usei $E(\varepsilon^2)=\operatorname{Var}(\varepsilon)$ por causa da média zero.`,
          ],
        },
        {
          id: "ch02-estimar-f-p2",
          prompt: r`<p>Num ponto $x_0=4$, a função verdadeira é $f(x)=2x$, mas você estimou $\hat f(x)=2{,}5x$. O ruído tem $\operatorname{Var}(\varepsilon)=9$.</p><p>(a) Quanto vale o erro redutível em $x_0$?<br>(b) Qual o erro quadrático esperado total?<br>(c) Se você trocasse por um modelo perfeito, qual seria o erro esperado?</p>`,
          hints: [
            r`Calcule $f(4)$ e $\hat f(4)$ separadamente.`,
            r`Redutível é $[f-\hat f]^2$. Total é redutível mais $\operatorname{Var}(\varepsilon)$.`,
          ],
          solution: r`<p>$f(4)=8$ e $\hat f(4)=10$.</p><p>(a) Redutível: $(8-10)^2=4$.<br>(b) Total: $4+9=13$.<br>(c) Modelo perfeito: só sobra o irredutível, $9$. Você não passa abaixo disso.</p>`,
          rubric: [
            r`Calculei $f(4)=8$ e $\hat f(4)=10$.`,
            "(a) = 4.",
            "(b) = 13.",
            "(c) = 9, e percebi que 9 é o piso.",
          ],
        },
      ],
      spot: {
        intro: r`<p>Um colega afirma ter encontrado $\hat f=f$ exatamente, e conclui que o erro de previsão futuro será zero. <b>Qual passo do raciocínio dele está errado?</b></p>`,
        steps: [
          r`$Y=f(X)+\varepsilon$, com $\varepsilon$ independente de $X$.`,
          r`Se $\hat f=f$, o termo redutível $[f-\hat f]^2$ vale zero.`,
          r`Então o erro esperado é $\operatorname{Var}(\varepsilon)$.`,
          r`Como o modelo é perfeito, $\operatorname{Var}(\varepsilon)$ também vale zero.`,
        ],
        wrong: 3,
        why: r`$\operatorname{Var}(\varepsilon)$ pertence ao fenômeno, não ao modelo. Melhorar $\hat f$ só atua no termo redutível.`,
      },
      cards: [
        {
          id: "ch02-estimar-f-c1",
          q: "Diferença entre erro redutível e irredutível?",
          a: r`Redutível: $[f-\hat f]^2$, melhora com um método melhor. Irredutível: $\operatorname{Var}(\varepsilon)$, vem do que $X$ não explica e nenhum método remove.`,
        },
        {
          id: "ch02-estimar-f-c2",
          q: r`Em qual objetivo $\hat f$ pode ser uma caixa-preta, e em qual não pode?`,
          a: "Pode na previsão (só importa acertar). Não pode na inferência (precisamos entender a forma da relação).",
        },
        {
          id: "ch02-estimar-f-c3",
          q: r`Escreva a decomposição do erro quadrático esperado com $X$ e $\hat f$ fixos.`,
          a: r`$E(Y-\hat Y)^2=[f(X)-\hat f(X)]^2+\operatorname{Var}(\varepsilon)$ (equação 2.3).`,
        },
        {
          id: "ch02-estimar-f-c4",
          q: r`Cite as duas origens do erro irredutível $\varepsilon$.`,
          a: "Variáveis relevantes não medidas, e variação inerente ao fenômeno (impossível de medir).",
        },
      ],
      deepDive: r`Na página 19 o livro lista as perguntas típicas de <b>inferência</b> (quais preditores importam, sinal da relação, se a forma é linear) e dá o exemplo de marketing direto como um problema de previsão. Vale conferir lá a distinção com seus próprios exemplos.`,
    },

    /* ───────── 2.1.2–2.1.3 ───────── */
    {
      id: "ch02-parametrico",
      title: "Como estimar f: paramétrico, não paramétrico e o dilema da flexibilidade",
      minutes: 12,
      book: "Seções 2.1.2–2.1.3, pp. 20–25",
      hook: "Escolher a forma de f é apostar. Quanto mais livre a curva, mais ela pode se enganar.",
      predict: {
        q: "Um modelo linear e uma spline muito flexível são ajustados aos mesmos 30 pontos. Qual tem mais risco de seguir o ruído dos dados (overfitting)?",
        options: ["O linear", "A spline muito flexível", "Os dois igualmente"],
        answer: 1,
        why: r`Quanto mais formas um método consegue produzir, mais fácil é ele acompanhar até o ruído. A spline flexível do livro (Fig. 2.6) passa por quase todos os pontos de treino, e erra feio fora deles.`,
      },
      blocks: [
        {
          kind: "text",
          title: "Duas famílias de métodos",
          body: r`<p><b>Paramétricos</b> têm dois passos: (1) <i>supor uma forma</i> para $f$, por exemplo linear, $f(X)=\beta_0+\beta_1X_1+\dots+\beta_pX_p$; (2) <i>ajustar</i> os parâmetros com os dados de treino, tipicamente por mínimos quadrados.</p>
<p>Reduzimos o problema de estimar uma função arbitrária a estimar $p+1$ números.</p>`,
          margin:
            "“Treinar” e “ajustar” são sinônimos aqui: usar os dados de treino para escolher os parâmetros.",
        },
        {
          kind: "text",
          title: "O preço da aposta",
          body: r`<p>Se a forma suposta estiver longe da verdadeira, o modelo estima mal, por mais dados que se tenha. Dá para usar modelos paramétricos mais flexíveis, mas isso exige estimar mais parâmetros e abre a porta ao <b>overfitting</b>: ajustar o ruído como se fosse sinal.</p>
<p><b>Não paramétricos</b> não supõem forma alguma. Podem se ajustar a muitas formas, mas precisam de <b>muitas observações</b> para isso, e também sofrem de overfitting.</p>`,
        },
        {
          kind: "key",
          title: "Flexibilidade × interpretabilidade",
          body: r`<p>Métodos mais <b>restritos</b> (gerando poucas formas) são mais fáceis de interpretar. Métodos mais <b>flexíveis</b> ajustam melhor, mas explicam pior.</p>
<p>Mapa do livro (Fig. 2.7), da maior interpretabilidade para a menor: seleção de subconjuntos e lasso → mínimos quadrados → GAMs e árvores → bagging, boosting e SVM → deep learning.</p>`,
          margin:
            "O lasso é menos flexível que mínimos quadrados: zera alguns coeficientes. Por isso é mais interpretável.",
        },
        {
          kind: "warn",
          title: "Contraintuitivo",
          body: r`<p>Se só queremos prever, o método mais flexível não é necessariamente o melhor. Muitas vezes um método <b>menos</b> flexível prevê melhor, justamente por evitar overfitting. Isso volta com força em 2.2.</p>`,
        },
      ],
      paper: [
        {
          id: "ch02-param-p1",
          prompt: r`<p>Você tem $n=200$ mercados e $p=3$ preditores.</p><p>(a) Quantos parâmetros um modelo linear estima?<br>(b) Se acrescentar <b>todos</b> os termos quadráticos e de interação de 2ª ordem ($X_iX_j$ com $i\le j$), quantos parâmetros passam a ser? Conte à mão.<br>(c) Repita (b) para $p=100$. O que acontece em relação a $n=200$?</p>`,
          hints: [
            r`Linear: intercepto mais um coeficiente por preditor.`,
            r`Termos $X_iX_j$ com $i\le j$: há $p$ termos $X_i^2$ e $\binom p2$ interações. Total $p(p+1)/2$.`,
          ],
          solution: r`<p>(a) $p+1=4$.<br>(b) $1+3+\tfrac{3\cdot4}{2}=1+3+6=10$.<br>(c) $1+100+\tfrac{100\cdot101}{2}=1+100+5050=5151$ parâmetros, muito mais que as $200$ observações. O modelo tem liberdade para passar por todos os pontos de treino e decorar o ruído: overfitting quase garantido.</p>`,
          rubric: [
            "(a) = 4.",
            r`(b) = 10, contando $1+3+6$.`,
            "(c) = 5151, e percebi que passa muito de $n=200$.",
            "Conectei muitos parâmetros e poucos dados com overfitting.",
          ],
        },
        {
          id: "ch02-param-p2",
          prompt: r`<p>Sem olhar o livro, <b>desenhe no caderno</b> um eixo horizontal “flexibilidade” (baixa → alta) e um vertical “interpretabilidade” (baixa → alta). Posicione: lasso, mínimos quadrados, GAM, árvores, bagging/boosting, SVM, deep learning.</p>`,
          hints: [
            "Comece pelos extremos: quem é o mais fácil de ler e o mais caixa-preta?",
            "Árvores e GAMs ficam no meio. Bagging e boosting combinam muitas árvores.",
          ],
          solution: r`<p>A tendência é uma descida: mais flexibilidade, menos interpretabilidade. Do canto superior esquerdo para o inferior direito: <b>lasso</b> (e seleção de subconjuntos) → <b>mínimos quadrados</b> → <b>GAM</b> e <b>árvores</b> → <b>SVM</b> e <b>bagging/boosting</b> → <b>deep learning</b>.</p><p>A ordem exata no meio é aproximada. O importante é a tendência.</p>`,
          rubric: [
            "Desenhei uma tendência decrescente (mais flexível, menos interpretável).",
            "Lasso ficou mais interpretável que mínimos quadrados.",
            "GAM e árvores ficaram no meio.",
            "Deep learning ficou no extremo de maior flexibilidade e menor interpretabilidade.",
          ],
        },
      ],
      spot: {
        intro: r`<p>Ana ajustou três modelos aos mesmos dados de treino. <b>Em que passo o raciocínio dela quebra?</b></p>`,
        steps: [
          "Uma spline muito flexível segue quase todos os pontos de treino.",
          "Logo, o erro dela nos dados de treino é pequeno.",
          "Como o erro de treino é o menor, ela também será a melhor com dados novos.",
          "Portanto devo sempre escolher o método mais flexível disponível.",
        ],
        wrong: 2,
        why: r`Erro de treino pequeno não garante erro de teste pequeno. Seguir o ruído de treino é exatamente o overfitting. O passo 4 é só consequência do erro no passo 3.`,
      },
      cards: [
        {
          id: "ch02-param-c1",
          q: "Quais os dois passos de um método paramétrico?",
          a: r`(1) Supor uma forma para $f$ (ex.: linear). (2) Ajustar os parâmetros com os dados de treino (ex.: mínimos quadrados).`,
        },
        {
          id: "ch02-param-c2",
          q: "Desvantagem principal do método paramétrico? E do não paramétrico?",
          a: "Paramétrico: a forma suposta pode estar longe da verdadeira. Não paramétrico: exige muitas observações.",
        },
        {
          id: "ch02-param-c3",
          q: "O que é overfitting, em uma frase?",
          a: "Ajustar o ruído dos dados de treino como se fosse sinal, o que piora o desempenho em dados novos.",
        },
        {
          id: "ch02-param-c4",
          q: "Por que o lasso é mais interpretável que mínimos quadrados?",
          a: "Ele zera alguns coeficientes, então a resposta fica relacionada a poucos preditores.",
        },
      ],
      deepDive: r`A Figura 2.7 (p. 24) e a discussão logo abaixo dela comparam lasso, GAMs, bagging, boosting, SVM e deep learning nos dois eixos. Se quiser ver o desenho oficial para comparar com o seu, é lá.`,
    },

    /* ───────── 2.1.4–2.1.5 ───────── */
    {
      id: "ch02-tipos",
      title: "Supervisionado ou não, regressão ou classificação",
      minutes: 6,
      book: "Seções 2.1.4–2.1.5, pp. 25–27",
      hook: "Duas perguntas rápidas que decidem qual caixa de ferramentas abrir.",
      blocks: [
        {
          kind: "key",
          title: "Pergunta 1: existe resposta Y?",
          body: r`<p><b>Supervisionado:</b> para cada $x_i$ há um $y_i$. Ajustamos um modelo para prever ou explicar $y$.</p>
<p><b>Não supervisionado:</b> só há $x_i$, sem resposta. Procuramos estrutura, por exemplo grupos de clientes parecidos (<b>análise de agrupamento</b>, <i>clustering</i>).</p>`,
        },
        {
          kind: "key",
          title: "Pergunta 2: Y é número ou categoria?",
          body: r`<p><b>Regressão:</b> resposta quantitativa (salário, preço). <b>Classificação:</b> resposta qualitativa (sobe/desce, tipo de tumor).</p>`,
        },
        {
          kind: "warn",
          title: "O nome engana",
          body: r`<p>A <b>regressão logística</b> é um método de <i>classificação</i>, apesar do nome. Ela estima probabilidades de classe, e por isso também pode ser vista como regressão. Já o KNN serve para os dois casos. Escolhemos o método pelo tipo da <b>resposta</b>, não pelo nome.</p>`,
        },
        {
          kind: "text",
          title: "E o meio-termo",
          body: r`<p>Existe o <b>aprendizado semissupervisionado</b>: temos $y_i$ só para parte das observações (rotular é caro) e usamos tudo. Está fora do escopo do livro, mas é bom saber que existe.</p>`,
        },
      ],
      paper: [
        {
          id: "ch02-tipos-p1",
          prompt: r`<p>No caderno, classifique cada situação em <b>supervisionado</b> (regressão ou classificação) ou <b>não supervisionado</b>, e justifique em uma linha:</p><p>1. Prever o preço de um imóvel a partir de área e bairro.<br>2. Decidir se um e-mail é spam.<br>3. Agrupar clientes de e-commerce pelo padrão de compras, sem rótulos.<br>4. Prever em quantos meses um paciente terá recaída.<br>5. Descobrir que genes variam juntos entre amostras.<br>6. Dizer se um tumor é benigno ou maligno.</p>`,
          hints: [
            "Primeiro: existe um resultado conhecido que queremos prever? Depois: é número ou categoria?",
          ],
          solution: r`<p>1. Supervisionado, <b>regressão</b> (preço é número).<br>2. Supervisionado, <b>classificação</b> (spam ou não).<br>3. <b>Não supervisionado</b> (agrupamento, sem resposta).<br>4. Supervisionado, <b>regressão</b> (tempo é número; no capítulo 11 você verá que dados de sobrevivência têm um cuidado extra).<br>5. <b>Não supervisionado</b> (sem resposta; busca de estrutura).<br>6. Supervisionado, <b>classificação</b> (duas classes).</p>`,
          rubric: [
            "Acertei os dois itens não supervisionados (3 e 5).",
            "Acertei as duas classificações (2 e 6).",
            "Acertei as duas regressões (1 e 4).",
            "Justifiquei pelo tipo da resposta, não pelo nome do método.",
          ],
        },
      ],
      cards: [
        {
          id: "ch02-tipos-c1",
          q: "Regressão logística é regressão ou classificação?",
          a: "Classificação (a resposta é categórica). Ela estima probabilidades de classe, por isso também pode ser vista como regressão.",
        },
        {
          id: "ch02-tipos-c2",
          q: "Como decidir entre regressão e classificação?",
          a: "Pelo tipo da resposta $Y$: quantitativa → regressão; qualitativa → classificação.",
        },
      ],
    },

    /* ───────── 2.2.1 ───────── */
    {
      id: "ch02-erro-teste",
      title: "Medir o erro: treino não é teste",
      minutes: 12,
      book: "Seção 2.2.1, pp. 27–31",
      hook: "O erro que importa é o dos dados que o modelo nunca viu.",
      predict: {
        q: "Conforme aumentamos a flexibilidade do modelo, o MSE de treino…",
        options: ["Sempre diminui", "Forma um U", "Sempre aumenta"],
        answer: 0,
        why: r`O MSE de <b>treino</b> cai com a flexibilidade (o modelo se ajusta cada vez mais aos pontos). Quem forma um U é o MSE de <b>teste</b>. Essa diferença é o assunto da lição.`,
      },
      blocks: [
        {
          kind: "text",
          title: "O erro quadrático médio",
          body: r`<p>Em regressão, a medida padrão é o <b>MSE</b> (erro quadrático médio):</p>$$\text{MSE}=\frac1n\sum_{i=1}^n\big(y_i-\hat f(x_i)\big)^2$$<p>Pequeno quando as previsões ficam perto das respostas; grande quando algumas ficam longe.</p>`,
        },
        {
          kind: "key",
          title: "Treino versus teste",
          body: r`<p>Calculado nos dados usados para ajustar o modelo, esse é o <b>MSE de treino</b>. Mas o que queremos é o <b>MSE de teste</b>: o erro em observações novas $(x_0,y_0)$ que não participaram do ajuste,</p>$$\text{Ave}\big(y_0-\hat f(x_0)\big)^2.$$<p>Queremos o método com o menor MSE de <i>teste</i>.</p>`,
          margin:
            "Exemplo do livro: ninguém liga se o modelo acerta o preço da ação da semana passada. O que vale é amanhã.",
        },
        {
          kind: "key",
          title: "A curva em U",
          body: r`<p>Com mais flexibilidade, o MSE de treino <b>sempre cai</b>. O MSE de teste cai no início e depois <b>sobe</b>, formando um U. Esse padrão aparece nos três exemplos do livro (Figuras 2.9 a 2.11).</p>
<p>Quando o treino está bem abaixo do teste, o modelo está em <b>overfitting</b>.</p>`,
        },
        {
          kind: "warn",
          title: "Armadilha",
          body: r`<p>Escolher o método pelo menor MSE de <b>treino</b> leva quase sempre ao mais flexível, que é justamente o que mais sobreajusta. Sem um conjunto de teste, o livro oferece uma saída: a <b>validação cruzada</b> (Cap. 5).</p>`,
        },
      ],
      paper: [
        {
          id: "ch02-teste-p1",
          prompt: r`<p>Um modelo foi ajustado e fez estas previsões:</p><p><b>Treino:</b> $y=(3,5,8,10)$, $\hat y=(2,6,8,12)$.<br><b>Teste:</b> $y_0=(4,9)$, $\hat y_0=(6,7)$.</p><p>Calcule à mão o MSE de treino e o MSE de teste. Qual é maior? O que isso sugere?</p>`,
          hints: [
            r`Erro de cada ponto: $y-\hat y$. Depois eleve ao quadrado, some e divida por $n$.`,
          ],
          solution: r`<p><b>Treino:</b> erros $1,-1,0,-2$; quadrados $1,1,0,4$; soma $6$; $\text{MSE}=6/4=1{,}5$.</p><p><b>Teste:</b> erros $-2,2$; quadrados $4,4$; soma $8$; $\text{MSE}=8/2=4$.</p><p>O MSE de teste (4) é bem maior que o de treino (1,5). Isso é o que se espera: o modelo foi otimizado para os pontos de treino e generaliza pior. Uma diferença grande é sinal de overfitting.</p>`,
          rubric: [
            "MSE de treino = 1,5.",
            "MSE de teste = 4.",
            "Dividi pelo número de observações de cada conjunto (4 e 2).",
            "Interpretei teste maior que treino como sinal de overfitting.",
          ],
        },
        {
          id: "ch02-teste-p2",
          prompt: r`<p>Sem olhar o livro, <b>esboce no caderno</b> um gráfico com eixo x “flexibilidade” e eixo y “MSE”. Desenhe a curva de treino e a de teste, uma linha tracejada para o erro irredutível, e marque três regiões: <i>underfitting</i>, melhor modelo e <i>overfitting</i>.</p>`,
          hints: [
            "Uma curva só desce. A outra desce e sobe.",
            r`O MSE de teste nunca fica abaixo de $\operatorname{Var}(\varepsilon)$.`,
          ],
          solution: r`<p>Curva de <b>treino</b>: decrescente, sempre. Curva de <b>teste</b>: forma de U, com mínimo no melhor modelo. A linha tracejada horizontal em $\operatorname{Var}(\varepsilon)$ fica <b>abaixo</b> do mínimo do teste. À esquerda do mínimo: underfitting (flexibilidade de menos). À direita: overfitting (treino cai, teste sobe).</p>`,
          rubric: [
            "Treino decrescente, teste em U.",
            "Linha do erro irredutível abaixo do mínimo do teste.",
            "Marquei underfitting à esquerda do mínimo e overfitting à direita.",
          ],
        },
      ],
      spot: {
        intro: r`<p>Três modelos têm MSE de treino 4,1 (linear), 2,0 (spline média) e 0,1 (spline muito flexível). Marcos conclui qual é o melhor. <b>Onde o raciocínio falha?</b></p>`,
        steps: [
          "O MSE de treino cai quando a flexibilidade aumenta.",
          "A spline muito flexível tem o menor MSE de treino, 0,1.",
          "Logo ela é o melhor modelo para prever dados novos.",
          "Então vou usá-la em produção.",
        ],
        wrong: 2,
        why: r`Para comparar modelos precisamos do MSE de <b>teste</b> (ou de uma estimativa dele, como validação cruzada). O de treino favorece sempre o modelo mais flexível.`,
      },
      cards: [
        {
          id: "ch02-teste-c1",
          q: r`Escreva a fórmula do MSE e diga o que é $\hat f(x_i)$.`,
          a: r`$\text{MSE}=\frac1n\sum(y_i-\hat f(x_i))^2$. $\hat f(x_i)$ é a previsão do modelo para a observação $i$.`,
        },
        {
          id: "ch02-teste-c2",
          q: "Por que não escolher o modelo pelo MSE de treino?",
          a: "Ele diminui sempre com a flexibilidade; favorece o modelo mais flexível, que costuma sobreajustar. O que importa é o erro em dados novos.",
        },
        {
          id: "ch02-teste-c3",
          q: "Como o MSE de treino e o de teste se comportam com a flexibilidade?",
          a: "Treino: cai sempre. Teste: cai e depois sobe (forma de U).",
        },
      ],
      deepDive: r`As Figuras 2.9, 2.10 e 2.11 (pp. 29–32) mostram o mesmo padrão em três cenários: função quase linear, quase linear com pouco ruído e fortemente não linear. Dá para ver como o ponto ótimo de flexibilidade muda de um cenário para outro.`,
    },

    /* ───────── 2.2.2 ───────── */
    {
      id: "ch02-vies-variancia",
      title: "Viés e variância: por que o teste faz um U",
      minutes: 14,
      book: "Seção 2.2.2, pp. 31–34",
      hook: "O erro de teste tem três ingredientes. Você só controla dois, e eles brigam entre si.",
      predict: {
        q: "Ao aumentar a flexibilidade de um método, em geral…",
        options: ["A variância sobe e o viés cai", "A variância cai e o viés sobe", "Os dois caem"],
        answer: 0,
        why: r`Um método flexível se molda aos dados (viés baixo), mas muda muito se os dados mudarem (variância alta). A lição desenvolve isso.`,
      },
      blocks: [
        {
          kind: "key",
          title: "A decomposição",
          body: r`<p>Num ponto $x_0$, o erro de teste esperado sempre se decompõe em três partes:</p>$$E\big(y_0-\hat f(x_0)\big)^2=\operatorname{Var}\big(\hat f(x_0)\big)+\big[\operatorname{Bias}\big(\hat f(x_0)\big)\big]^2+\operatorname{Var}(\varepsilon)$$<p>“Esperado” significa: a média sobre muitos conjuntos de treino diferentes, cada um gerando um $\hat f$ próprio, todos testados em $x_0$.</p>`,
          margin: "A prova matemática está fora do livro. Aqui basta saber ler a equação.",
        },
        {
          kind: "text",
          title: "Variância",
          body: r`<p>É quanto $\hat f$ <b>muda</b> se trocarmos o conjunto de treino. Variância alta: pequenas mudanças nos dados mexem muito no resultado. Em geral, métodos mais flexíveis têm variância maior: a curva verde da Fig. 2.9 segue os pontos tão de perto que mudar um deles a desloca.</p>`,
        },
        {
          kind: "text",
          title: "Viés",
          body: r`<p>É o erro causado por <b>aproximar um problema real, talvez complicado, por um modelo simples demais</b>. Se a verdade é muito curva e você ajusta uma reta, essa reta erra de forma sistemática, por mais dados que tenha. Em geral, métodos mais flexíveis têm viés menor.</p>`,
        },
        {
          kind: "analogy",
          title: "Uma imagem",
          body: r`<p>Alvo de dardos. <b>Viés</b>: o centro do seu agrupamento está longe do alvo. <b>Variância</b>: seus dardos estão espalhados. O melhor lançador acerta o centro e agrupa apertado, mas se você está aprendendo, melhorar um costuma piorar o outro.</p>`,
        },
        {
          kind: "key",
          title: "O dilema",
          body: r`<p>É fácil ter <b>viés baixo e variância alta</b> (uma curva que passa por todos os pontos de treino) ou <b>variância baixa e viés alto</b> (uma reta horizontal). O desafio é achar o meio. À medida que a flexibilidade cresce, o viés cai mais rápido do que a variância sobe, até um ponto em que isso inverte. Daí o U.</p>
<p>Como as duas parcelas são não negativas, o erro de teste esperado <b>nunca fica abaixo</b> de $\operatorname{Var}(\varepsilon)$.</p>`,
        },
        {
          kind: "deep",
          title: "Toca do coelho: e na prática?",
          body: r`<p>Em dados reais não conhecemos $f$, então não dá para calcular viés e variância explicitamente. Mas a ideia guia as escolhas: ao estudar regularização (Cap. 6) e árvores com bagging (Cap. 8), a pergunta de fundo é sempre “como reduzir variância sem inflar demais o viés?”.</p>`,
        },
      ],
      paper: [
        {
          id: "ch02-vv-p1",
          prompt: r`<p>Em $x_0$, três modelos têm (variância de $\hat f$, viés², $\operatorname{Var}(\varepsilon)$):</p><p>A: $(0{,}5;\ 4;\ 1)$ &nbsp; B: $(1{,}5;\ 1;\ 1)$ &nbsp; C: $(6;\ 0{,}2;\ 1)$.</p><p>(a) Calcule o erro de teste esperado de cada um. (b) Qual o melhor? (c) Qual o menor erro que <i>qualquer</i> modelo poderia ter? (d) Ordene A, B, C por flexibilidade, justificando.</p>`,
          hints: [
            "Soma das três parcelas, modelo a modelo.",
            "O piso é a parcela que nenhum modelo controla.",
          ],
          solution: r`<p>(a) A: $0{,}5+4+1=5{,}5$. B: $1{,}5+1+1=3{,}5$. C: $6+0{,}2+1=7{,}2$.<br>(b) <b>B</b>, o equilíbrio.<br>(c) $\operatorname{Var}(\varepsilon)=1$: nenhum modelo passa abaixo disso.<br>(d) A &lt; B &lt; C em flexibilidade: A tem viés alto e variância baixa (rígido demais), C tem variância alta e viés baixo (se molda demais), B fica no meio.</p>`,
          rubric: [
            "Somei as três parcelas: 5,5; 3,5; 7,2.",
            "Escolhi B como melhor.",
            r`Identifiquei o piso $=1$.`,
            "Ordenei A, B, C justificando com viés alto/variância baixa e vice-versa.",
          ],
        },
        {
          id: "ch02-vv-p2",
          prompt: r`<p>Explique com as <b>suas palavras</b>, escrevendo no caderno, por que (i) uma reta horizontal fixa tem variância zero mas viés alto, e (ii) uma curva que passa por todos os pontos de treino tem viés baixo mas variância alta. Faça um desenho de dois ou três conjuntos de treino diferentes para a segunda.</p>`,
          hints: [
            r`Variância é “quanto $\hat f$ muda ao trocar os dados”. A reta horizontal muda?`,
            "Para (ii), imagine mudar um único ponto: o que acontece com a curva que o atravessa?",
          ],
          solution: r`<p>(i) Uma reta horizontal <i>fixa</i> ignora os dados, então não muda com o conjunto de treino: variância zero. Mas se a relação verdadeira é inclinada ou curva, ela erra sempre do mesmo jeito: viés alto.</p><p>(ii) A curva que atravessa todos os pontos acompanha cada um em média (viés baixo). Mas se um ponto muda, a curva inteira muda localmente: se treinamos em amostras diferentes, obtemos curvas bem diferentes entre si (variância alta).</p>`,
          rubric: [
            "Expliquei variância como sensibilidade ao conjunto de treino.",
            "Expliquei viés alto da reta fixa como erro sistemático.",
            "Para a curva flexível, mostrei (ou descrevi) que trocar um ponto muda a curva.",
          ],
        },
      ],
      spot: {
        intro: r`<p>Pedro resume a seção. <b>Onde está o erro?</b></p>`,
        steps: [
          r`$\operatorname{Var}(\varepsilon)$ mede o ruído de $Y$ e não depende do modelo.`,
          r`$\operatorname{Var}(\hat f(x_0))$ mede o quanto $\hat f$ muda ao treinar com outro conjunto de dados.`,
          "Aumentar a flexibilidade reduz variância e viés ao mesmo tempo, então sempre melhora o teste.",
          "Por isso o erro de teste nunca fica abaixo do erro irredutível.",
        ],
        wrong: 2,
        why: r`Aumentar a flexibilidade em geral <b>reduz o viés e aumenta a variância</b>. Esse conflito é exatamente o “trade-off”. O passo 4 está certo, mas não decorre do 3.`,
      },
      cards: [
        {
          id: "ch02-vv-c1",
          q: "Escreva a decomposição do erro de teste esperado em $x_0$ (eq. 2.7).",
          a: r`$E(y_0-\hat f(x_0))^2=\operatorname{Var}(\hat f(x_0))+[\operatorname{Bias}(\hat f(x_0))]^2+\operatorname{Var}(\varepsilon)$.`,
        },
        {
          id: "ch02-vv-c2",
          q: "O que significa variância de um método?",
          a: r`O quanto $\hat f$ mudaria se fosse estimado com outro conjunto de treino. Alta: pequenas mudanças nos dados causam grandes mudanças em $\hat f$.`,
        },
        {
          id: "ch02-vv-c3",
          q: "O que significa viés de um método?",
          a: "O erro de aproximar um problema real, possivelmente complicado, por um modelo simples demais.",
        },
        {
          id: "ch02-vv-c4",
          q: "Efeito de aumentar a flexibilidade sobre viés e variância?",
          a: "Viés tende a cair; variância tende a subir. O erro de teste forma um U.",
        },
      ],
      deepDive: r`A Figura 2.12 (p. 33) mostra, para os três cenários, as curvas de viés², variância e MSE de teste juntas. Ver os três cruzando é o melhor jeito de fixar por que o mínimo do teste muda de lugar de um caso para outro.`,
    },

    /* ───────── 2.2.3 ───────── */
    {
      id: "ch02-bayes-knn",
      title: "Classificação: o classificador de Bayes e o KNN",
      minutes: 14,
      book: "Seção 2.2.3, pp. 34–39",
      hook: "O melhor classificador possível existe, mas ninguém o tem. O KNN tenta chegar perto.",
      predict: {
        q: "No KNN, qual valor de K produz erro de treino igual a zero?",
        options: ["K = 1", "K = 100", "Qualquer K"],
        answer: 0,
        why: r`Com $K=1$ cada ponto de treino é o seu próprio vizinho mais próximo, então é sempre classificado certo. Isso não diz nada sobre o teste.`,
      },
      blocks: [
        {
          kind: "text",
          title: "Taxa de erro",
          body: r`<p>Quando $Y$ é qualitativo, medimos a fração de erros. A taxa de erro de <b>treino</b> é</p>$$\frac1n\sum_{i=1}^n I(y_i\neq\hat y_i),$$<p>onde $I$ vale 1 se classificou errado e 0 se acertou. A taxa de erro de <b>teste</b> é a média de $I(y_0\ne\hat y_0)$ em observações novas. Como antes, queremos a menor taxa de <i>teste</i>.</p>`,
        },
        {
          kind: "key",
          title: "O classificador de Bayes",
          body: r`<p>Em média, o menor erro de teste possível é obtido por uma regra simples: atribuir $x_0$ à classe $j$ que maximiza a probabilidade condicional</p>$$\Pr(Y=j\mid X=x_0).$$<p>Em duas classes: prever a classe 1 se $\Pr(Y=1\mid X=x_0)>0{,}5$. A fronteira onde a probabilidade é exatamente 50% é a <b>fronteira de decisão de Bayes</b>.</p>`,
          margin:
            "Nos dados simulados da Fig. 2.13, a taxa de erro de Bayes é 0,133 (e 0,1304 no exemplo da Fig. 2.15).",
        },
        {
          kind: "text",
          title: "O erro de Bayes",
          body: r`<p>A menor taxa de erro possível é a <b>taxa de erro de Bayes</b>. No ponto $x_0$ ela vale $1-\max_j\Pr(Y=j\mid X=x_0)$. No geral:</p>$$1-E\Big[\max_j\Pr(Y=j\mid X)\Big].$$<p>É maior que zero quando as classes se sobrepõem. É o análogo do erro irredutível da regressão.</p>`,
        },
        {
          kind: "text",
          title: "KNN: estimando as probabilidades",
          body: r`<p>Na prática não conhecemos $\Pr(Y=j\mid X)$. O <b>KNN</b> a estima: dado $K$ e um ponto $x_0$, acha os $K$ pontos de treino mais próximos ($\mathcal N_0$) e usa a fração de cada classe,</p>$$\Pr(Y=j\mid X=x_0)\approx\frac1K\sum_{i\in\mathcal N_0}I(y_i=j),$$<p>classificando na classe de maior fração.</p>`,
        },
        {
          kind: "key",
          title: "K é o botão de flexibilidade",
          body: r`<p><b>K pequeno</b>: fronteira recortada e muito flexível, <b>viés baixo e variância alta</b>. <b>K grande</b>: fronteira suave, quase linear, <b>variância baixa e viés alto</b>.</p>
<p>No exemplo do livro: K=1 e K=100 têm erro de teste 0,1695 e 0,1925; K=10 tem 0,1363, perto do erro de Bayes (0,1304).</p>`,
          margin: "A curva de erro de teste em função de 1/K (Fig. 2.17) também tem a forma de U.",
        },
        {
          kind: "warn",
          title: "Cuidado",
          body: r`<p>Com $K=1$ o erro de treino é <b>zero</b>, mas o de teste pode ser alto. Mesma lição da regressão: erro de treino não escolhe modelo.</p>`,
        },
      ],
      paper: [
        {
          id: "ch02-knn-p1",
          prompt: r`<p>No caderno, desenhe um plano $(x_1,x_2)$ e marque estes pontos de treino:</p><p>A $(1,1)$ azul · B $(2,1)$ azul · C $(0,3)$ laranja · D $(4,4)$ laranja · E $(5,3)$ laranja · F $(2,2)$ azul.</p><p>Classifique o ponto $x_0=(1;\,3{,}5)$ com <b>K = 1, 3 e 5</b>. Calcule as distâncias euclidianas à mão e, para K=3, dê a probabilidade estimada de cada classe.</p>`,
          hints: [
            r`Distância: $\sqrt{(a_1-b_1)^2+(a_2-b_2)^2}$. Calcule as seis e ordene.`,
            "Anote a classe de cada ponto ao lado da distância, já em ordem crescente.",
          ],
          solution: r`<p>Distâncias a $x_0=(1;3{,}5)$: C: $\sqrt{1+0{,}25}\approx1{,}12$ (laranja); F: $\sqrt{1+2{,}25}\approx1{,}80$ (azul); A: $2{,}5$ (azul); B: $\sqrt{1+6{,}25}\approx2{,}69$ (azul); D: $\sqrt{9+0{,}25}\approx3{,}04$ (laranja); E: $\sqrt{16+0{,}25}\approx4{,}03$ (laranja).</p><p><b>K=1:</b> C → laranja.<br><b>K=3:</b> C, F, A → laranja 1/3, azul 2/3 → <b>azul</b>.<br><b>K=5:</b> C, F, A, B, D → azul 3/5, laranja 2/5 → <b>azul</b>.</p><p>A previsão muda de K=1 para K=3: o ponto mais próximo sozinho mandava em K=1.</p>`,
          rubric: [
            "Calculei as seis distâncias e ordenei corretamente (C, F, A, B, D, E).",
            "K=1: laranja.",
            "K=3: azul, com probabilidade 2/3.",
            "K=5: azul, com probabilidade 3/5.",
            "Percebi que K=1 depende de um ponto só e mudou de resposta.",
          ],
        },
        {
          id: "ch02-bayes-p1",
          prompt: r`<p>$X$ assume três valores com probabilidades $\Pr(X=a)=0{,}5$, $\Pr(X=b)=0{,}3$, $\Pr(X=c)=0{,}2$. Dado $X$, a probabilidade da classe 1 é $0{,}9$, $0{,}6$ e $0{,}5$ respectivamente.</p><p>(a) Qual classe o classificador de Bayes prevê em cada valor de $X$? (b) Calcule a taxa de erro de Bayes.</p>`,
          hints: [
            r`Em cada $x$, o erro de Bayes é $1-\max_j\Pr(Y=j\mid x)$.`,
            "Depois tire a média ponderada pela probabilidade de cada $x$.",
          ],
          solution: r`<p>(a) $a$: classe 1 (0,9). $b$: classe 1 (0,6). $c$: empate em 0,5, qualquer classe serve.</p><p>(b) Erro em cada ponto: $0{,}1$; $0{,}4$; $0{,}5$. Média ponderada:</p>$$0{,}5\cdot0{,}1+0{,}3\cdot0{,}4+0{,}2\cdot0{,}5=0{,}05+0{,}12+0{,}10=0{,}27.$$<p>Nenhum classificador, por melhor que seja, erra menos de 27% neste problema.</p>`,
          rubric: [
            "Previ classe 1 em a e b, e reconheci o empate em c.",
            r`Calculei o erro em cada ponto como $1-\max$: 0,1; 0,4; 0,5.`,
            "Fiz a média ponderada e obtive 0,27.",
          ],
        },
      ],
      spot: {
        intro: r`<p>Lia treinou um KNN com $K=1$ e escreve sua conclusão. <b>Onde está o erro?</b></p>`,
        steps: [
          "Com K=1, cada ponto de treino é seu próprio vizinho mais próximo.",
          "Logo, o erro de treino do KNN com K=1 é zero.",
          "Como o erro de treino é zero, esse classificador é o melhor possível.",
          "Vou comparar com outros valores de K usando dados de teste.",
        ],
        wrong: 2,
        why: r`Erro de treino zero não diz nada sobre dados novos. O $K=1$ é muito flexível e costuma ter variância alta. O passo 4 é a atitude certa: comparar em teste.`,
      },
      cards: [
        {
          id: "ch02-bayes-c1",
          q: "O que o classificador de Bayes faz?",
          a: r`Atribui $x_0$ à classe $j$ que maximiza $\Pr(Y=j\mid X=x_0)$. Em duas classes, classe 1 se a probabilidade passa de 0,5.`,
        },
        {
          id: "ch02-bayes-c2",
          q: "O que é a taxa de erro de Bayes e qual seu análogo na regressão?",
          a: r`A menor taxa de erro de teste possível, $1-E[\max_j\Pr(Y=j\mid X)]$. Análogo: o erro irredutível $\operatorname{Var}(\varepsilon)$.`,
        },
        {
          id: "ch02-bayes-c3",
          q: "Como o KNN estima a probabilidade de uma classe em $x_0$?",
          a: "Pela fração dos $K$ vizinhos de treino mais próximos que pertencem à classe.",
        },
        {
          id: "ch02-bayes-c4",
          q: "Efeito de K pequeno versus K grande no KNN?",
          a: "K pequeno: muito flexível, viés baixo e variância alta (K=1 tem erro de treino 0). K grande: pouco flexível, variância baixa e viés alto.",
        },
      ],
      deepDive: r`As Figuras 2.14 a 2.17 (pp. 37–39) mostram o KNN com K=3, a fronteira com K=10 colada na de Bayes, K=1 contra K=100 e a curva de erro em função de 1/K. O laboratório Python da Seção 2.3 (pp. 40–63) é uma boa introdução prática às bibliotecas.`,
    },
  ],
};
export default ch;

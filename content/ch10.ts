import type { Chapter } from "@/lib/types";
const r = String.raw;

const ch: Chapter = {
  id: "ch10",
  num: 10,
  title: "Deep learning",
  pages: "pp. 399–467",
  blurb: "Redes neurais, convolucionais e recorrentes, e como treiná-las.",
  lessons: [
    {
      id: "ch10-redes",
      title: "Redes neurais: de uma camada a várias",
      minutes: 16,
      book: "Seções 10.1–10.2, pp. 400–406",
      hook: "Uma rede é regressão linear aplicada a features que ela mesma aprende.",
      blocks: [
        {
          kind: "key",
          title: "Rede de uma camada escondida",
          body: r`<p>Com $K$ unidades escondidas, cada uma calcula uma <b>ativação</b> a partir de uma combinação linear das entradas:</p>$$A_k=g\Big(w_{k0}+\sum_{j=1}^pw_{kj}X_j\Big),\qquad f(X)=\beta_0+\sum_{k=1}^K\beta_kA_k.$$<p>$g$ é a <b>função de ativação</b>. Sem não linearidade, tudo colapsaria em um modelo linear. As ativações $A_k$ são <b>features aprendidas</b>, em vez de escolhidas à mão.</p>`,
        },
        {
          kind: "text",
          title: "Ativações",
          body: r`<p><b>Sigmoide</b>: $g(z)=\frac{1}{1+e^{-z}}$, entre 0 e 1 (a mesma curva da logística). <b>ReLU</b>: $g(z)=\max(0,z)$, hoje a mais usada, barata de calcular e armazenar.</p>`,
        },
        {
          kind: "key",
          title: "Várias camadas e a saída",
          body: r`<p>Camadas escondidas empilhadas dão uma hierarquia de features. Na <b>saída</b>: regressão usa uma unidade linear e perda quadrática $\sum(y_i-f(x_i))^2$; classificação com $M$ classes usa <b>softmax</b>,</p>$$f_m(X)=\frac{e^{Z_m}}{\sum_{l=1}^Me^{Z_l}},$$<p>que dá probabilidades somando 1, treinadas com a <b>entropia cruzada</b> $-\sum_i\sum_my_{im}\log f_m(x_i)$.</p>`,
        },
        {
          kind: "text",
          title: "Quantos parâmetros?",
          body: r`<p>Cada camada com $n_{\text{in}}$ entradas e $n_{\text{out}}$ unidades tem $(n_{\text{in}}+1)\,n_{\text{out}}$ parâmetros (pesos mais viés). Redes têm muito mais parâmetros que observações e funcionam graças à regularização do treinamento.</p>`,
        },
      ],
      paper: [
        {
          id: "ch10-rede-p1",
          prompt: r`<p>Rede com entrada $x=(1,2)$ e duas unidades escondidas com ReLU: $z_1=0{,}5x_1-x_2$ e $z_2=-x_1+x_2+1$. Saída: $f=0{,}5+1\cdot A_1+0{,}5\cdot A_2$.</p><p>(a) Calcule $A_1,A_2$ e $f$. (b) Calcule o softmax de scores $(2,1,0)$. (c) Quantos parâmetros tem uma rede $784\to256\to128\to10$?</p>`,
          hints: [r`ReLU: $\max(0,z)$. Softmax: $e^{z}/\sum e^{z}$, com $e^2\approx7{,}389$.`],
          solution: r`<p>(a) $z_1=0{,}5-2=-1{,}5\Rightarrow A_1=0$. $z_2=-1+2+1=2\Rightarrow A_2=2$. $f=0{,}5+0+0{,}5\cdot2=1{,}5$.<br>(b) $e^2=7{,}389$, $e^1=2{,}718$, $e^0=1$; soma $=11{,}107$. Probabilidades: $0{,}665;\ 0{,}245;\ 0{,}090$.<br>(c) $(784+1)\cdot256=200\,960$; $(256+1)\cdot128=32\,896$; $(128+1)\cdot10=1\,290$. Total $=235\,146$.</p>`,
          rubric: [
            "$A_1=0$, $A_2=2$, $f=1{,}5$.",
            "Softmax $0{,}665;\\,0{,}245;\\,0{,}090$.",
            "235.146 parâmetros.",
          ],
        },
      ],
      cards: [
        {
          id: "ch10-rede-c1",
          q: "Descreva uma rede de uma camada escondida em fórmulas.",
          a: r`$A_k=g(w_{k0}+\sum w_{kj}X_j)$ e $f(X)=\beta_0+\sum\beta_kA_k$. As $A_k$ são features aprendidas; $g$ é a ativação não linear.`,
        },
        {
          id: "ch10-rede-c2",
          q: "Funções de ativação principais e por que são necessárias.",
          a: r`Sigmoide $1/(1+e^{-z})$ e ReLU $\max(0,z)$. Sem não linearidade a rede seria só um modelo linear.`,
        },
        {
          id: "ch10-rede-c3",
          q: "Que saída e perda usar em regressão e em classificação?",
          a: "Regressão: saída linear e perda quadrática. Classificação: softmax e entropia cruzada.",
        },
      ],
      deepDive: r`A rede com 235.146 parâmetros para dígitos MNIST é descrita em detalhes na Seção 10.2 (pp. 402–406), incluindo a comparação com regressão logística multinomial.`,
    },

    {
      id: "ch10-cnn-rnn",
      title: "Redes convolucionais e recorrentes",
      minutes: 14,
      book: "Seções 10.3–10.5, pp. 406–425",
      hook: "Explorar a estrutura dos dados: vizinhança em imagens, ordem em textos.",
      blocks: [
        {
          kind: "key",
          title: "Camadas convolucionais",
          body: r`<p>Para imagens, um <b>filtro</b> pequeno (ex.: $3\times3$) desliza pela imagem, e em cada posição calcula a soma dos produtos elemento a elemento. Detecta um padrão (borda, cor) <b>onde quer que apareça</b>. O mesmo filtro, com os <b>mesmos pesos</b>, é aplicado em todas as posições, o que reduz muito o número de parâmetros.</p>`,
        },
        {
          kind: "text",
          title: "Pooling e arquitetura",
          body: r`<p>A camada de <b>pooling</b> resume blocos (ex.: máximo em cada $2\times2$), reduzindo a resolução e dando tolerância a pequenas translações. Uma CNN alterna convolução e pooling, e termina em camadas densas e softmax. <b>Aumento de dados</b> (girar, cortar imagens) multiplica o conjunto de treino, e modelos <b>pré-treinados</b> podem ser reaproveitados.</p>`,
        },
        {
          kind: "key",
          title: "Redes recorrentes (RNN)",
          body: r`<p>Para <b>sequências</b> (texto, séries temporais), a rede lê um elemento por vez, mantendo um <b>estado escondido</b> que resume o passado: $A_\ell=g(w_0+W\,X_\ell+U\,A_{\ell-1})$. Os <b>mesmos pesos</b> valem em todos os instantes. Serve para classificar documentos e prever séries.</p>`,
        },
      ],
      paper: [
        {
          id: "ch10-cnn-p1",
          prompt: r`<p>(a) Convolução 1D (sem preenchimento) da entrada $(1,2,3,4,5)$ com o filtro $(1,0,-1)$. (b) Max pooling de tamanho 2 sobre $(1,3,2,4)$. (c) Quantos parâmetros tem uma camada convolucional com 5 filtros $3\times3$ sobre imagem RGB (3 canais), contando um viés por filtro? (d) Compare com uma camada densa de uma imagem $32\times32\times3$ para 5 unidades.</p>`,
          hints: [r`(a) Posição $i$: $x_i\cdot1+x_{i+1}\cdot0+x_{i+2}\cdot(-1)$.`],
          solution: r`<p>(a) $1-3=-2$; $2-4=-2$; $3-5=-2$. Saída: $(-2,-2,-2)$.<br>(b) $\max(1,3)=3$, $\max(2,4)=4$: $(3,4)$.<br>(c) $5\cdot(3\cdot3\cdot3+1)=5\cdot28=140$.<br>(d) Densa: $(32\cdot32\cdot3+1)\cdot5=15\,365$. Compartilhar pesos reduz drasticamente o número de parâmetros.</p>`,
          rubric: [
            "(a) $(-2,-2,-2)$.",
            "(b) $(3,4)$.",
            "(c) 140.",
            "(d) 15.365 e a conclusão sobre pesos compartilhados.",
          ],
        },
      ],
      cards: [
        {
          id: "ch10-cnn-c1",
          q: "O que faz uma camada convolucional e por que usa menos parâmetros?",
          a: "Aplica o mesmo filtro pequeno em todas as posições da imagem, detectando um padrão onde ele aparecer. Compartilhar pesos reduz muito os parâmetros.",
        },
        {
          id: "ch10-cnn-c2",
          q: "O que é pooling?",
          a: "Resumir blocos da imagem (ex.: máximo em $2\\times2$), reduzindo a resolução e dando tolerância a pequenas translações.",
        },
        {
          id: "ch10-cnn-c3",
          q: "Ideia central de uma RNN.",
          a: "Lê a sequência passo a passo mantendo um estado escondido que resume o passado, com os mesmos pesos em todos os instantes.",
        },
      ],
      deepDive: r`A Seção 10.3.5 (p. 412) mostra o uso de um classificador pré-treinado, e a Seção 10.5.2 (p. 420) aplica uma RNN a previsão de séries temporais (volume da bolsa).`,
    },

    {
      id: "ch10-treino",
      title: "Treinar redes: gradiente, regularização e quando usar",
      minutes: 14,
      book: "Seções 10.6–10.8, pp. 425–435",
      hook: "A rede decora o treino por padrão. O treinamento precisa de freios.",
      blocks: [
        {
          kind: "key",
          title: "Descida do gradiente",
          body: r`<p>Minimizamos a perda $R(\theta)$ por passos na direção oposta ao gradiente: $\theta\leftarrow\theta-\rho\,\nabla R(\theta)$, com $\rho$ a <b>taxa de aprendizado</b>. A <b>retropropagação</b> calcula o gradiente eficientemente pela regra da cadeia. Na <b>descida do gradiente estocástica (SGD)</b>, cada passo usa só um <b>minilote</b> de observações; uma passada por todos os dados é uma <b>época</b>.</p>`,
        },
        {
          kind: "text",
          title: "Freios contra overfitting",
          body: r`<p><b>Regularização</b> $\ell_1$/$\ell_2$ nos pesos (como ridge e lasso), <b>dropout</b> (desligar unidades ao acaso em cada passo) e <b>parada antecipada</b> (parar quando o erro de validação sobe). Ajustar a rede (camadas, unidades, $\rho$, lote) é um problema de validação.</p>`,
        },
        {
          kind: "warn",
          title: "Quando usar deep learning",
          body: r`<p>Brilha com muitos dados e sinais complexos (imagens, texto, áudio). Em dados tabulares pequenos, um modelo mais simples (regressão regularizada, florestas) costuma igualar ou superar, e é mais fácil de interpretar. O livro recomenda ajustar modelos simples primeiro e usar a rede só se compensar.</p>`,
        },
        {
          kind: "text",
          title: "Dupla descida",
          body: r`<p>Mesmo quando a rede tem parâmetros suficientes para <b>interpolar</b> o treino (erro zero), o erro de teste pode voltar a cair ao aumentar ainda mais a flexibilidade: a <b>dupla descida</b>. Não contradiz o dilema viés-variância; mostra que o U não é a única forma possível.</p>`,
        },
      ],
      paper: [
        {
          id: "ch10-gd-p1",
          prompt: r`<p>$R(\theta)=(\theta-3)^2$, $\theta_0=0$, $\rho=0{,}25$. (a) Dê o gradiente. (b) Calcule $\theta_1,\theta_2,\theta_3$. (c) Por que converge e para quê? (d) Com $n=60\,000$ e lote de 128, quantos passos tem uma época?</p>`,
          hints: [r`$\nabla R=2(\theta-3)$.`],
          solution: r`<p>(a) $2(\theta-3)$.<br>(b) $\theta_1=0-0{,}25(-6)=1{,}5$; $\theta_2=1{,}5-0{,}25(-3)=2{,}25$; $\theta_3=2{,}25-0{,}25(-1{,}5)=2{,}625$.<br>(c) Cada passo reduz a distância até 3 pela metade ($1-2\rho=0{,}5$): converge para o mínimo $\theta=3$.<br>(d) $60\,000/128=468{,}75\to469$ passos.</p>`,
          rubric: [
            "Gradiente $2(\\theta-3)$.",
            "1,5; 2,25; 2,625.",
            "Convergência a 3 e o fator 0,5.",
            "469 passos por época.",
          ],
        },
      ],
      cards: [
        {
          id: "ch10-gd-c1",
          q: "Atualização da descida do gradiente e o que é SGD.",
          a: r`$\theta\leftarrow\theta-\rho\nabla R(\theta)$. SGD usa só um minilote por passo; uma época é uma passada por todos os dados.`,
        },
        {
          id: "ch10-gd-c2",
          q: "Três técnicas de regularização em redes.",
          a: "Penalidades nos pesos ($\\ell_1/\\ell_2$), dropout e parada antecipada.",
        },
        {
          id: "ch10-gd-c3",
          q: "Quando preferir um modelo mais simples a uma rede?",
          a: "Com poucos dados ou dados tabulares: modelos simples e regularizados costumam igualar a rede e são mais interpretáveis.",
        },
      ],
      deepDive: r`A Seção 10.8 (p. 432) discute dupla descida com um exemplo de splines, e a Seção 10.7.4 (p. 431) trata do ajuste de hiperparâmetros da rede. O laboratório está nas pp. 435–464.`,
    },
  ],
};
export default ch;

// js/scenes/cutscene.js

/**
 * Módulo de Gerenciamento de Cutscenes
 * Gerencia a exibição sequencial de imagens PNG como cenas de história.
 */

// Configuração das imagens da cutscene
const configCutscene = {
  // Lista de caminhos para as imagens PNG (em ordem de exibição)
  imagensSrc: [
    "assets/drawings/cutscenes/PrimeiraCutscene.png",
    "assets/drawings/cutscenes/SegundaCutscene.png",
    "assets/drawings/cutscenes/TerceiraCutscene.png",
    // Adicione mais caminhos aqui conforme necessário
  ],
  // Cena para onde ir após a cutscene acabar
  cenaDestinoFinal: "selecao",
};

// Estado interno do módulo de cutscene
let estadoCutscene = {
  imagens: [], // Array de objetos Image carregados
  indiceAtual: 0, // Índice da imagem sendo exibida agora
  carregadas: false, // Flag para saber se todas as imagens carregaram
  larguraNativa: 1920, // Resolução nativa de arte (1080p)
  alturaNativa: 1080,
};

/**
 * Inicializa o módulo: carrega todas as imagens da lista.
 * Deve ser chamado uma vez no início do jogo.
 */
function inicializarCutscenes() {
  console.log("Inicializando Cutscenes...");
  let carregadasCounter = 0;
  const totalImagens = configCutscene.imagensSrc.length;

  if (totalImagens === 0) {
    estadoCutscene.carregadas = true;
    console.warn("Nenhuma imagem de cutscene definida.");
    return;
  }

  // Carrega cada imagem da lista
  configCutscene.imagensSrc.forEach((src, index) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      carregadasCounter++;
      // Quando todas carregarem, marca o módulo como pronto
      if (carregadasCounter === totalImagens) {
        estadoCutscene.carregadas = true;
        console.log("Todas as imagens de cutscene carregadas.");
      }
    };
    img.onerror = () => {
      console.error(`Erro ao carregar a imagem da cutscene: ${src}`);
    };
    estadoCutscene.imagens[index] = img; // Mantém a ordem
  });
}

/**
 * Função de Renderização Principal da Cutscene
 * Desenha a imagem atual no canvas, redimensionando-a.
 */
function renderCutscene(ctx) {
  // 1. Limpa a tela com preto
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, estadoCutscene.larguraNativa, estadoCutscene.alturaNativa);

  // 2. Verifica se o módulo está pronto e a imagem atual existe
  if (!estadoCutscene.carregadas) {
    // Tela de carregamento simples (opcional)
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      "Carregando história...",
      estadoCutscene.larguraNativa / 2,
      estadoCutscene.alturaNativa / 2,
    );
    return;
  }

  const imgAtual = estadoCutscene.imagens[estadoCutscene.indiceAtual];

  if (imgAtual && imgAtual.complete) {
    // 3. Desenha a imagem redimensionada para ocupar todo o canvas (stretch)
    // Usamos a resolução nativa (1920x1080) definida no main.js
    ctx.drawImage(
      imgAtual,
      0,
      0,
      estadoCutscene.larguraNativa,
      estadoCutscene.alturaNativa,
    );

    // Opcional: Adicionar um pequeno indicador de "Clique para continuar"
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "20px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(
      "Clique para continuar...",
      estadoCutscene.larguraNativa - 20,
      estadoCutscene.alturaNativa - 20,
    );
  }
}

/**
 * Verifica e processa cliques do mouse na cena de cutscene.
 * Retorna 'proxima_cena' se a cutscene acabaram.
 */
function checkCutsceneClick() {
  if (!estadoCutscene.carregadas) return null;

  // Avança para a próxima imagem
  estadoCutscene.indiceAtual++;

  // Verifica se chegamos ao fim da sequência
  if (estadoCutscene.indiceAtual >= estadoCutscene.imagens.length) {
    // Reseta o índice para a próxima vez que a cutscene for usada
    estadoCutscene.indiceAtual = 0;
    return "proxima_cena"; // Sinaliza que a cutscene acabaram
  }

  return null; // Ainda há imagens na sequência
}

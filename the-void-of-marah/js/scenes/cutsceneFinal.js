const configCutsceneFinal = {
  imagensSrc: [
    "assets/drawings/cutscenes/final/CutsceneFinal1.png",
    "assets/drawings/cutscenes/final/CutsceneFinal2.png",
    "assets/drawings/cutscenes/final/CutsceneFinal3.png",
    "assets/drawings/cutscenes/final/CutsceneFinal4.png",
    "assets/drawings/cutscenes/final/CutsceneFinal5.png",
  ],
};

let estadoCutsceneFinal = {
  imagens: [],
  indiceAtual: 0,
  carregadas: false,
  opacidade: 0,
  fadeVelocidade: 0.05,
};

function inicializarCutsceneFinal() {
  estadoCutsceneFinal.carregadas = true; // Força true para não travar o jogo
  configCutsceneFinal.imagensSrc.forEach((src, index) => {
    const img = new Image();
    img.src = src;
    img.onerror = () => console.warn("Falha ao carregar: " + src);
    estadoCutsceneFinal.imagens[index] = img;
  });
}

function renderCutsceneFinal(ctx) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 1920, 1080);

  if (estadoCutsceneFinal.opacidade < 1) {
    estadoCutsceneFinal.opacidade += estadoCutsceneFinal.fadeVelocidade;
  }

  const imgAtual = estadoCutsceneFinal.imagens[estadoCutsceneFinal.indiceAtual];
  if (imgAtual && imgAtual.complete) {
    ctx.save();
    ctx.globalAlpha = estadoCutsceneFinal.opacidade;
    ctx.drawImage(imgAtual, 0, 0, 1920, 1080);
    ctx.restore();
  }
}

function checkCutsceneFinalClick() {
  if (estadoCutsceneFinal.opacidade < 1) {
    estadoCutsceneFinal.opacidade = 1;
    return null;
  }

  estadoCutsceneFinal.indiceAtual++;

  if (estadoCutsceneFinal.indiceAtual >= estadoCutsceneFinal.imagens.length) {
    return "fim_jogo";
  }

  estadoCutsceneFinal.opacidade = 0;
  return null;
}
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Resolução lógica fixa para manter a proporção da arte
canvas.width = 1920;
canvas.height = 1080;

let mousePos = { x: 0, y: 0 };
let state = {
  cena: "menu",
  volume: 10,
  volumeAntesDeMutar: 10,
  mutado: false,
  transicao: 0,
  emTransicao: false,
  proximaCena: "",
};

const assets = {
  fundo: new Image(),
  btnStart: new Image(),
  btnCreditos: new Image(),
};

// Carregamento dos Assets
assets.fundo.src = "assets/drawings/TitleScreenUI/background/TelaInicial.png";
assets.btnStart.src = "assets/drawings/TitleScreenUI/buttons/btn_start.png";
assets.btnCreditos.src =
  "assets/drawings/TitleScreenUI/buttons/btn_creditos.png";

function loop() {
  // Limpa o canvas e garante Pixel Art nítida
  ctx.clearRect(0, 0, 1920, 1080);
  ctx.imageSmoothingEnabled = false;

  // Gerenciador de Cenas
  if (state.cena === "menu") {
    renderMenu(ctx, assets, state, mousePos.x, mousePos.y);
  } else if (state.cena === "selecao") {
    renderSelecao(ctx);
  } else if (state.cena === "creditos") {
    renderCreditos(ctx);
  }

  // Lógica de Transição (Flash Branco)
  if (state.emTransicao) {
    state.transicao += 0.05;
    if (state.transicao >= 1) {
      state.cena = state.proximaCena;
      state.emTransicao = false;
    }
  } else if (state.transicao > 0) {
    state.transicao -= 0.05;
  }

  if (state.transicao > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${state.transicao})`;
    ctx.fillRect(0, 0, 1920, 1080);
  }

  requestAnimationFrame(loop);
}

// Monitoramento do Mouse (Convertendo para 1920x1080)
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mousePos.x = (e.clientX - rect.left) * (1920 / rect.width);
  mousePos.y = (e.clientY - rect.top) * (1080 / rect.height);
});

// Processamento de Cliques
canvas.addEventListener("mousedown", (e) => {
  if (state.emTransicao) return;

  const acao = checkMenuClick(mousePos.x, mousePos.y, assets);

  if (acao === "iniciar") {
    state.proximaCena = "selecao";
    state.emTransicao = true;
  } else if (acao === "creditos") {
    state.proximaCena = "creditos";
    state.emTransicao = true;
  } else if (acao === "mudar_mudo") {
    if (!state.mutado) {
      state.volumeAntesDeMutar = state.volume;
      state.volume = 0;
      state.mutado = true;
    } else {
      state.volume = state.volumeAntesDeMutar;
      state.mutado = false;
    }
  } else if (acao === "aumentar") {
    if (state.volume < 10) state.volume++;
    state.mutado = false;
  } else if (acao === "diminuir") {
    if (state.volume > 0) state.volume--;
    if (state.volume === 0) state.mutado = true;
  }
});

// Atalho para voltar ao menu
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && state.cena !== "menu") {
    state.proximaCena = "menu";
    state.emTransicao = true;
  }
});

assets.fundo.onload = () => loop();

kaboom({
  width: 1600,
  height: 900,
  letterbox: true,
});

loadSprite("fundo", "assets/drawings/titleScreenUI/background/TelaInicial.png");
loadSprite(
  "botao_start",
  "assets/drawings/titleScreenUI/buttons/btn_start.png",
);

scene("menu", () => {
  let volumeValor = 10;
  let mutado = false;
  let volumeAntesDeMutar = 10;

  add([sprite("fundo"), pos(width() / 2, height() / 2), anchor("center")]);

  const startBtn = add([
    sprite("botao_start"),
    pos(370, 600),
    anchor("center"),
    area(),
  ]);

  const labelVolume = add([
    text(volumeValor.toString(), { size: 30 }),
    pos(390, 520),
    anchor("center"),
  ]);

  const btnMenos = add([
    text("-", { size: 40 }),
    pos(360, 520),
    anchor("center"),
    area(),
  ]);

  const btnMais = add([
    text("+", { size: 40 }),
    pos(430, 520),
    anchor("center"),
    area(),
  ]);

  const btnMudo = add([
    text("🔊", { size: 30 }),
    pos(325, 520),
    anchor("center"),
    area(),
  ]);

  function atualizarSom() {
    labelVolume.text = volumeValor.toString();
    volume(volumeValor / 10);
    btnMudo.text = mutado || volumeValor === 0 ? "🔇" : "🔊";
  }

  onMousePress("left", () => {
    // Clique no Start
    if (startBtn.isHovering()) {
      startBtn.scale = vec2(0.9);
      wait(0.1, () => {
        startBtn.scale = vec2(1);
        console.log("Jogo Iniciado!");
      });
    }

    if (btnMais.isHovering()) {
      if (mutado) {
        mutado = false;
        volumeValor = volumeAntesDeMutar;
      }
      if (volumeValor < 10) volumeValor++;
      atualizarSom();
    }

    if (btnMenos.isHovering()) {
      if (mutado) {
        mutado = false;
        volumeValor = volumeAntesDeMutar;
      }
      if (volumeValor > 0) volumeValor--;
      atualizarSom();
    }

    if (btnMudo.isHovering()) {
      if (!mutado) {
        volumeAntesDeMutar = volumeValor;
        volumeValor = 0;
        mutado = true;
      } else {
        volumeValor = volumeAntesDeMutar;
        mutado = false;
      }
      atualizarSom();
    }
  });

  onUpdate(() => {
    if (
      startBtn.isHovering() ||
      btnMais.isHovering() ||
      btnMenos.isHovering() ||
      btnMudo.isHovering()
    ) {
      setCursor("pointer");
    } else {
      setCursor("default");
    }
  });
});

go("menu");

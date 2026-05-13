kaboom({
  width: 1600,
  height: 900,
  letterbox: true,
});

// Carregamento de Assets
loadSprite("fundo", "assets/drawings/titleScreenUI/background/TelaInicial.png");
loadSprite("botao_start", "assets/drawings/titleScreenUI/buttons/btn_start.png");

// Cena Principal: Menu
scene("menu", () => {
  let volumeValor = 10;
  let mutado = false;
  let volumeAntesDeMutar = 10;

  // Fundo
  add([
    sprite("fundo"), 
    pos(width() / 2, height() / 2), 
    anchor("center")
  ]);

  // Botão Start
  const startBtn = add([
    sprite("botao_start"),
    pos(370, 600),
    anchor("center"),
    area(),
  ]);

  // Elementos da UI de Volume
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

  // Função para atualizar visual e som
  function atualizarSom() {
    labelVolume.text = volumeValor.toString();
    volume(volumeValor / 10);
    btnMudo.text = mutado || volumeValor === 0 ? "🔇" : "🔊";
  }

  // Interação: Segurar o Botão Start
  onMouseDown("left", () => {
    if (startBtn.isHovering()) {
      startBtn.scale = vec2(0.9);
    }
  });

  // Interação: Soltar o Botão Start (com Fade)
  onMouseRelease("left", () => {
    startBtn.scale = vec2(1);

    if (startBtn.isHovering()) {
      // Criar o efeito de Fade Out (Tela ficando branca)
      const flash = add([
        rect(width(), height()),
        pos(0, 0),
        color(255, 255, 255),
        opacity(0),
        fixed(),
        z(100),
      ]);

      tween(
        0,
        1,
        0.5,
        (v) => (flash.opacity = v),
        easings.easeInQuad
      ).then(() => {
        go("selecao"); // Muda para a próxima tela
      });
    }
  });

  // Interação: Cliques nos botões de Volume
  onMousePress("left", () => {
    // Botão Mais (+)
    if (btnMais.isHovering()) {
      if (mutado) {
        mutado = false;
        volumeValor = volumeAntesDeMutar;
      }
      if (volumeValor < 10) volumeValor++;
      atualizarSom();
    }

    // Botão Menos (-)
    if (btnMenos.isHovering()) {
      if (mutado) {
        mutado = false;
        volumeValor = volumeAntesDeMutar;
      }
      if (volumeValor > 0) volumeValor--;
      atualizarSom();
    }

    // Botão Mudo
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

  // Cursor dinâmico
  onUpdate(() => {
    const hovering =
      startBtn.isHovering() ||
      btnMais.isHovering() ||
      btnMenos.isHovering() ||
      btnMudo.isHovering();
    setCursor(hovering ? "pointer" : "default");
  });
});

// Iniciar o jogo
go("menu");
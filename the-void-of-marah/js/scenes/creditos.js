function renderCreditos(ctx) {
  // Fundo preto
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 1920, 1080);

  ctx.fillStyle = "white";
  ctx.textAlign = "center";

  ctx.font = "60px Arial";
  ctx.fillText("CRÉDITOS", 1920 / 2, 200);

  ctx.font = "40px Arial";
  ctx.fillText("Arte geral: Ágatha Ariell, Rhawan Henrique", 1920 / 2, 400);
  ctx.fillText("Programação: Pedro Júlio, Gabriel Haddad, Thawan Campos, Felipe Eduardo", 1920 / 2, 500);

  ctx.font = "25px Arial";
  ctx.fillText("Pressione ESC para voltar ao Menu", 1920 / 2, 900);
}

window.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  const currentState = window.state;
  if (!currentState || currentState.cena !== "creditos" || currentState.emTransicao) return;

  event.preventDefault();
  currentState.proximaCena = "menu";
  currentState.emTransicao = true;
});

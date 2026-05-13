function renderSelecao(ctx) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 1920, 1080);

  ctx.fillStyle = "white";
  ctx.font = "60px Arial";
  ctx.textAlign = "center";
  ctx.fillText("TELA DE SELEÇÃO", 1920 / 2, 1080 / 2);

  ctx.font = "30px Arial";
  ctx.fillText("Maya e Zeck aparecerão aqui!", 1920 / 2, 1080 / 2 + 80);
}

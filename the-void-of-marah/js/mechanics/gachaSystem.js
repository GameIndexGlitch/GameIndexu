// Define os itens que podem ser sorteados na recompensa gacha e aplica seus efeitos ao jogador.

const ATAQUES_JOGO = {
  soco: { id: "soco", nome: "SOCO", dano: 2 },
  chute_forte: { id: "chute_forte", nome: "CHUTE FORTE", dano: 4 }
};

const GACHA_ITENS = [
  { nome: "Poção de Cura", tipo: "vida", valor: 3, descricao: "Recupera 3 pontos de vida máxima e cura imediatamente o mesmo valor.", cor: "#8cffb6" },
  { nome: "Escudo do Guardião", tipo: "defesa", valor: 2, descricao: "Aumenta a defesa em 2 pontos, reduzindo o dano recebido.", cor: "#8cc8ff" },
  { nome: "Lâmina Rápida", tipo: "ataque", valor: 1, descricao: "Aumenta o dano em 1 ponto para o próximo combate.", cor: "#ffd56b" },
  { nome: "Elixir de Vigor", tipo: "vida", valor: 5, descricao: "Aumenta a vida máxima em 5 pontos e restaura a vida atual.", cor: "#7dffb8" },
  { nome: "Aço Refinado", tipo: "defesa", valor: 3, descricao: "Fortifica o personagem com +3 de defesa permanente.", cor: "#9ed4ff" },
  { nome: "Foco de Cerimônia", tipo: "ataque", valor: 2, descricao: "Foco a força do personagem em +2 de ataque permanente.", cor: "#ffe285" },

  { 
    nome: "Chute Forte", 
    tipo: "novo_ataque", 
    ataqueId: "chute_forte",
    valor: 4, 
    descricao: "Aprende a habilidade Chute Forte, que causa 4 de dano.", 
    cor: "#ff7b00" 
  },
];

// Retorna três itens aleatórios diferentes a partir da lista de gacha.
function sortearItensGacha(state) {
  // O jogador começa só com soco se não tiver nada salvo
  let ataquesDoPlayer = (state && state.ataques) ? state.ataques : ["soco"];
  
  const copias = GACHA_ITENS.filter(item => {
    // Se for um ataque, verifica se o jogador JÁ TEM. Se tiver, remove da caixa de sorteio!
    if (item.tipo === "novo_ataque") {
      return !ataquesDoPlayer.includes(item.ataqueId);
    }
    return true; // Outros itens (poção, defesa) podem vir sempre
  });

  const itens = [];
  while (copias.length > 0 && itens.length < 3) {
    const index = Math.floor(Math.random() * copias.length);
    itens.push(copias.splice(index, 1)[0]);
  }
  return itens;
}

// Aplica o bônus do item gacha ao estado do jogador.
function aplicarBonusGacha(state, item) {
  if (!state || !state.stats || !item) return;

  if (item.tipo === "vida") {
    state.stats.vidaMax = Math.max(1, state.stats.vidaMax + item.valor);
    state.stats.vida = Math.min(state.stats.vidaMax, state.stats.vida + item.valor);
  } else if (item.tipo === "defesa") {
    state.stats.defesa += item.valor;
  } else if (item.tipo === "ataque") {
    state.stats.ataque += item.valor;
  } 
  // --- ENSINANDO O JOGO A GUARDAR O NOVO ATAQUE ---
  else if (item.tipo === "novo_ataque") {
    if (!state.ataques) state.ataques = ["soco"];
    
    // Se ele ainda tem espaço (máximo 4) e não tem o golpe, adiciona!
    if (state.ataques.length < 4 && !state.ataques.includes(item.ataqueId)) {
      state.ataques.push(item.ataqueId);
    }
  }
}

window.gachaSystem = {
  GACHA_ITENS,
  gerarItensGacha: sortearItensGacha,
  aplicarBonusGacha,
};

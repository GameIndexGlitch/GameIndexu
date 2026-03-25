import { Engine } from './core/Engine.js';

const game = new Engine('gameCanvas');

// Inicializa o motor
game.init().catch(err => {
    console.error("Falha ao despertar no Vazio:", err);
});
import { AssetLoader } from '../utils/AssetLoader.js';

export class Engine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.loader = new AssetLoader();
        this.lastTime = 0;

        // Estados: 'EXPLORATION' ou 'COMBAT'
        this.gameState = 'EXPLORATION';

        // Configuração de tela para o Vazio
        this.canvas.width = 1280;
        this.canvas.height = 720;
    }

    async init() {
        // Exemplo de como a gente vai carregar nossas spritesheets depois
        // await this.loader.loadImage('hero', '/assets/sprites/iris_sheet.png');
        // await this.loader.loadImage('background', '/assets/backgrounds/vazio_marah.png');

        this.start();
    }

    start() {
        requestAnimationFrame(this.loop.bind(this));
    }

    loop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame(this.loop.bind(this));
    }

    update(deltaTime) {
        // Lógica de movimento ou cartas baseada no estado
        if (this.gameState === 'EXPLORATION') {
            // Atualiza física das plataformas
        } else if (this.gameState === 'COMBAT') {
            // Atualiza lógica de turnos e mana (18 pontos) [cite: 35]
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Renderiza o cenário ou a arena circular do Guardião [cite: 25]
        this.ctx.fillStyle = '#FFFFFF'; // O "Silêncio Branco" inicial [cite: 2]
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'black';
        this.ctx.fillText(`Estado: ${this.gameState}`, 20, 30);
    }
}
import { AssetLoader } from '../utils/AssetLoader.js';

export class InitialScene {
    constructor(engine) {
        this.engine = engine;
        this.animationTime = 0;
        this.rectWidth = 250;
        this.rectHeight = 100;
        this.confirming = false;
        this.confirmTime = 0;
        this.hoveredIndex = -1;
        this.assetLoader = new AssetLoader();

        // pixels pra subir o botão do centro da tela:
        this.offsetYSubida = 150;

        this.assetLoader.loadImage('background', './assets/backgrounds/fundotelainicial.png')
            .then(() => console.log('Imagem de fundo carregada'))
            .catch(err => console.error('Erro ao carregar imagem:', err));

        this.assetLoader.loadImage('startButton', './assets/sprites/buttons/botao_start.png')
            .then(() => console.log('Sprite do botão carregada'))
            .catch(err => console.error('Erro ao carregar botão:', err));
    }

    // Atualiza o estado da cena
    updateHover() {
        this.hoveredIndex = -1;
        if (this.engine.mouseX !== undefined && this.engine.mouseY !== undefined) {
            const x = (this.engine.canvas.width - this.rectWidth) / 2;
            const y = (this.engine.canvas.height - this.rectHeight) / 2 - this.offsetYSubida; // <-- Ajuste de altura aqui

            if (this.engine.mouseX >= x && this.engine.mouseX <= x + this.rectWidth &&
                this.engine.mouseY >= y && this.engine.mouseY <= y + this.rectHeight) {
                this.hoveredIndex = 0;
            }
        }
    }

    // Atualiza o estado da cena, incluindo animações e lógica de confirmação
    update(deltaTime) {
        this.animationTime += deltaTime;
        if (this.confirming) {
            this.confirmTime += deltaTime;
            if (this.confirmTime > 1000) { // 1 segundo de animação
                this.engine.gameState = 'SELECTION'; // Muda para seleção
            }
        } else {
            this.updateHover();
        }
    }

    draw(ctx) {
        // Desenha o fundo primeiro
        const bg = this.assetLoader.get('background');
        if (bg) {
            ctx.drawImage(bg, 0, 0, this.engine.canvas.width, this.engine.canvas.height);
        } else {
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, this.engine.canvas.width, this.engine.canvas.height);
        }

        // Desenha o botão no centro e ajustado para cima
        const x = (this.engine.canvas.width - this.rectWidth) / 2;
        const y = (this.engine.canvas.height - this.rectHeight) / 2 - this.offsetYSubida; // <-- Ajuste de altura aqui

        const isHovered = this.hoveredIndex === 0;
        const scale = isHovered ? 1.05 : 1;
        const scaledWidth = this.rectWidth * scale;
        const scaledHeight = this.rectHeight * scale;
        const offsetX = (this.rectWidth - scaledWidth) / 2;
        const offsetY = (this.rectHeight - scaledHeight) / 2;

        if (isHovered) {
            ctx.shadowColor = '#60402b';
            ctx.shadowBlur = 20;
        }

        // Tenta pegar a imagem do botão que carregamos
        const btnImage = this.assetLoader.get('startButton');

        if (btnImage) {
            // Se a imagem carregou com sucesso, desenha ela!
            ctx.drawImage(btnImage, x + offsetX, y + offsetY, scaledWidth, scaledHeight);
        } else {
            // Se der erro de carregamento, desenha um retângulo marrom de segurança
            ctx.fillStyle = '#60402b';
            ctx.fillRect(x + offsetX, y + offsetY, scaledWidth, scaledHeight);

            ctx.fillStyle = '#FFF';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Start', x + this.rectWidth / 2, y + this.rectHeight / 2 + 8);
        }

        ctx.shadowColor = 'transparent'; // Remove a sombra pro resto da tela
    }

    selectButon() {
        this.confirming = true; // Inicia animação de confirmação
        this.confirmTime = 0;
    }

    handleInput(mouseX, mouseY) {
        const x = (this.engine.canvas.width - this.rectWidth) / 2;
        const y = (this.engine.canvas.height - this.rectHeight) / 2 - this.offsetYSubida; // <-- Ajuste de altura aqui do clique

        if (mouseX >= x && mouseX <= x + this.rectWidth && mouseY >= y && mouseY <= y + this.rectHeight) {
            this.selectButon();
        }
    }
}
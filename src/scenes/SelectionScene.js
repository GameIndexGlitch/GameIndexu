export class SelectionScene {
    constructor(engine) {
        this.engine = engine;//Referência ao motor
        this.characters = [
            { name: 'Irís Shadowlace', class: 'Feiticeira Suraggel', color: '#FF4500', portrait: './assets/sprites/cartas_select/CartaIris.png' }, //Fogo
            { name: 'Atom Shadowlace', class: 'Golem de Pedra', color: '#708090', portrait: './assets/sprites/cartas_select/CartaAtom.png' }, //Metal
            { name: 'Ioruh', class: 'Moreau Coruja Inventor', color: '#8B4513', portrait: './assets/sprites/cartas_select/CartaIoruh.png' }, //Madeira
            { name: 'Toshy', class: 'Necromante Osteon', color: '#00BFFF', portrait: './assets/sprites/cartas_select/CartaToshy.png' }, //Fogo Azul
            { name: 'Mogli', class: 'Arqueiro Trog', color: '#228B22', portrait: './assets/sprites/cartas_select/CartaMogli.png' }, //Folha
            { name: 'Thanatá', class: 'Maga Humana', color: '#FFD700', portrait: './assets/sprites/cartas_select/CartaThanata.png' } //Moeda
        ];

        this.characters.forEach((char) => {
            char.image = new Image();
            char.image.loaded = false;
            char.image.src = char.portrait;
            char.image.onload = () => { char.image.loaded = true; };
        });


       // Carregando a imagem de fundo da seleção
        this.bgImage = new Image();
        this.bgImage.loaded = false;
        this.bgImage.src = './assets/backgrounds/fundotelaselecao.png';
        this.bgImage.onload = () => { this.bgImage.loaded = true; };

        this.rectWidth = 180; //Largura do card de seleção
        this.rectHeight = 320; //Altura do card de seleção
        this.startX = 50; //Margem esquerda de 50px para o conjunto de cards
        this.startY = 200; //Posição Y inicial
        this.spacing = 20; //Espaço entre cards
        this.portraitWidth = 128; //Largura do sprite de portrait
        this.portraitHeight = 192; //Altura do sprite de portrait
        this.hoveredIndex = -1; //Índice do card em hover
        this.animationTime = 0; //Tempo para animações
        this.confirming = false; //Estado de confirmação
        this.confirmTime = 0; //Tempo da animação de confirmação
    }

    updateHover() {
        this.hoveredIndex = -1;
        if (this.engine.mouseX !== undefined && this.engine.mouseY !== undefined) {
            this.characters.forEach((char, index) => {
                const x = this.startX + index * (this.rectWidth + this.spacing);
                if (this.engine.mouseX >= x && this.engine.mouseX <= x + this.rectWidth &&
                    this.engine.mouseY >= this.startY && this.engine.mouseY <= this.startY + this.rectHeight) {
                    this.hoveredIndex = index;
                }
            });
        }
    }

    update(deltaTime) {
        this.animationTime += deltaTime;
        if (this.confirming) {
            this.confirmTime += deltaTime;
            if (this.confirmTime > 1000) { // 1 segundo de animação
                this.engine.gameState = 'EXPLORATION'; //Muda para o jogo
            }
        } else {
            // Atualiza hover
            this.updateHover();
        }
    } //Reservado para animações

    draw(ctx) {
        // MODIFICAÇÃO: Desenha a imagem de fundo em vez do branco
        if (this.bgImage && this.bgImage.loaded) {
            ctx.drawImage(this.bgImage, 0, 0, this.engine.canvas.width, this.engine.canvas.height);
        } else {
            // Fallback: se a imagem demorar a carregar, fica preto/branco
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, this.engine.canvas.width, this.engine.canvas.height);
        }

        this.characters.forEach((char, index) => {
            const x = this.startX + index * (this.rectWidth + this.spacing); //Posição X do card
            const isHovered = this.hoveredIndex === index;
            const scale = isHovered ? 1.05 : 1; //Leve aumento no hover
            const scaledWidth = this.rectWidth * scale;
            const scaledHeight = this.rectHeight * scale;
            const offsetX = (this.rectWidth - scaledWidth) / 2;
            const offsetY = (this.rectHeight - scaledHeight) / 2;

            // Brilho bege no hover
            if (isHovered) {
                ctx.shadowColor = '#60402b';
                ctx.shadowBlur = 20;
            }

            if (char.image && char.image.loaded) {
                ctx.drawImage(char.image, x + offsetX, this.startY + offsetY, scaledWidth, scaledHeight);
            } else {
                ctx.fillStyle = char.color; //Cor do herói
                ctx.fillRect(x + offsetX, this.startY + offsetY, scaledWidth, scaledHeight); //Desenha card
            }

            ctx.shadowColor = 'transparent'; //Reseta sombra

            // Descrição dinâmica
            ctx.fillStyle = '#000'; // DICA: Se o fundo for escuro, mude aqui para '#FFF' também
            ctx.font = '16px Arial'; //Fonte do nome
            ctx.textAlign = 'center';
            ctx.fillText(char.name, x + this.rectWidth / 2, this.startY + this.rectHeight + 40); //Nome
            ctx.font = '12px Arial';
            ctx.fillText(char.class, x + this.rectWidth / 2, this.startY + this.rectHeight + 60); //Classe
        });

        // Animação de confirmação
        if (this.confirming) {
            const alpha = Math.min(this.confirmTime / 500, 1); //Fade in
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.fillRect(0, 0, this.engine.canvas.width, this.engine.canvas.height);
        }
    }

    handleInput(mouseX, mouseY) {
        this.characters.forEach((char, index) => {
            const x = this.startX + index * (this.rectWidth + this.spacing); //Posição X para checar
            if (mouseX >= x && mouseX <= x + this.rectWidth &&
                mouseY >= this.startY && mouseY <= this.startY + this.rectHeight) {
                this.selectCharacter(char); //Seleciona se clicar dentro
            }
        });
    }

    selectCharacter(char) {
        this.engine.selectedCharacter = char; //Salva a escolha
        this.confirming = true; //Inicia animação de confirmação
        this.confirmTime = 0;
    }
}
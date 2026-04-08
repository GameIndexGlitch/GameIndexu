export class Player {
    constructor(color, physics, characterName) {
        this.x = 100; //Posição horizontal inicial no Vazio [cite: 3]
        this.y = 500; //Posição vertical inicial acima da plataforma
        this.width = 50; //Largura do retângulo (espaço para sua sprite futura)
        this.height = 80; //Altura do retângulo (espaço para sua sprite futura)
        this.color = color; //Cor definida pela escolha na SelectionScene
        this.characterName = characterName; // Armazena nome

        // Configuração da Sprite da Iris
        this.irisSprite = new Image();
        this.irisSprite.src = 'assets/sprites/cartas_select/SpriteSheetIdleIris.png'
        this.irisLoad = false;
        this.irisSprite.onload = () => { this.irisLoad = true; };

        this.numberOfFrames = 10; // Quantidade de frames
        this.frameIndex = 0; // Frame atual
        this.tickCount = 0; // Contador de frames de atualização
        this.ticksPerFrame = 6; // Velocidade que passa os frames

        this.velocityX = 0; //Velocidade lateral atual
        this.velocityY = 0; //Velocidade vertical (gravidade/pulo)
        this.speed = 5; //Velocidade de caminhada pelo cenário
        this.jumpForce = -12; //Força do impulso para desafiar a gravidade [cite: 10]
        this.isGrounded = false; //Verifica se o herói está tocando o chão de pedra [cite: 5]

        this.physics = physics; // Sistema de física
    }

    update() {
        // atualiza a animação
        if (this.characterName == 'Irís Shadowlace') {
            this.tickCount++;
            if(this.tickCount > this.ticksPerFrame) {
                this.tickCount = 0;
                // Avança frame e volta pro inicio quando chega a zero
                this.frameIndex = (this.frameIndex + 1) % this.numberOfFrames;
            }
        }

        // Aplica física usando o sistema Physics.js
        if (this.physics) {
            this.physics.applyPhysics(this);
        } else {
            // Fallback para física básica se não houver sistema de física
            this.velocityY += 0.5; // Gravidade básica
            this.y += this.velocityY;
            this.x += this.velocityX;

            // Colisão básica com o chão
            if (this.y + this.height > 600) {
                this.y = 600 - this.height;
                this.velocityY = 0;
                this.isGrounded = true;
            }
        }
    }

    draw(ctx) {
        // Verifica se é a Irís E se ela está parada (velocidades zeradas e no chão)
        const estaParada = this.velocityX === 0 && this.velocityY === 0 && this.isGrounded;

        if (this.characterName === 'Irís Shadowlace' && this.irisLoad && estaParada) {
            // Desenha apenas parada
            const frameWidth = this.irisSprite.width / this.numberOfFrames;
            const frameHeight = this.irisSprite.height;

            ctx.drawImage(
                this.irisSprite,
                this.frameIndex * frameWidth, 0,
                frameWidth, frameHeight,
                this.x, this.y,
                this.width, this.height
            );

        } else {
            // Desenha o bloco colorido
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    jump() {
        if (this.isGrounded) {
            this.velocityY = this.jumpForce; //Aplica o impulso para cima
            this.isGrounded = false; //O herói agora está no ar [cite: 10]
        }
    }
}
export class InputHandler { // Define e exporta a classe para que possa ser usada em outros arquivos do jogo
    constructor(engine, player) { // O construtor recebe o motor e o jogador para que possa modificá-lo
        this.engine = engine;
        this.player = player; // Armazena a referência do jogador dentro da classe

        // "Caderninho" para anotar quais teclas estão pressionadas no momento
        this.keys = {
            left: false,
            right: false
        };

        // Escuta quando uma tecla é pressionada
        window.addEventListener('keydown', (e) => {
            if (this.engine.gameState !== 'EXPLORATION') return; // não responde fora da exploração

            // Marca no caderninho que a tecla está sendo segurada
            if (e.code === 'KeyA') this.keys.left = true;
            if (e.code === 'KeyD') this.keys.right = true;

            // O pulo continua aqui porque é uma ação de clique único
            if (e.code === 'Space') this.player.jump();
        });

        // Escuta quando uma tecla é solta
        window.addEventListener('keyup', (e) => {
            if (this.engine.gameState !== 'EXPLORATION') return;

            // Marca no caderninho que a tecla foi solta
            if (e.code === 'KeyA') this.keys.left = false;
            if (e.code === 'KeyD') this.keys.right = false;
        });
    }

    // NOVA FUNÇÃO: O motor do jogo vai chamar isso constantemente!
    update() {
        if (this.engine.gameState !== 'EXPLORATION') return;

        // Se SÓ a esquerda (A) estiver apertada
        if (this.keys.left && !this.keys.right) {
            this.player.velocityX = -this.player.speed;
        }
        // Se SÓ a direita (D) estiver apertada
        else if (this.keys.right && !this.keys.left) {
            this.player.velocityX = this.player.speed;
        }
        // Se nenhuma (ou ambas ao mesmo tempo) estiverem apertadas, o boneco para
        else {
            this.player.velocityX = 0;
        }
    }
}
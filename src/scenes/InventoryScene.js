export class InventoryScene {
    constructor(engine) {
        this.engine = engine;
        this.width = 900;
        this.height = 700;
        this.x = (1280 - this.width) / 2;
        this.y = (720 - this.height) / 2;

        // Caixa do portrait (Rosto do personagem na esquerda)
        this.portraitBox = { x: this.x + 50, y: this.y + 90, width: 200, height: 200 };

        // NOVA GRADE DO INVENTÁRIO (Quadrados Maiores)
        this.grid = {
            cols: 4, // Menos itens por fileira (antes eram 5)
            rows: 5,
            slotSize: 90, // Quadrados bem maiores (antes era 64)
            gap: 20,
            x: this.x + 360, // Posicionado na direita da tela
            y: this.y + 90
        };

        // SLOTS DE EQUIPAR (Menores e debaixo do Portrait)
        const eqSize = 75; // Tamanho dos quadrados de equipamento
        const eqGap = 15;
        // Centraliza os 3 quadrados embaixo do portrait
        const eqTotalWidth = (3 * eqSize) + (2 * eqGap);
        const eqStartX = this.portraitBox.x + (this.portraitBox.width - eqTotalWidth) / 2;
        const eqStartY = this.y + 380; // Posição Y logo abaixo do nome do personagem

        this.equipmentSlots = [
            { key: 'weapon', label: 'Arma', x: eqStartX, y: eqStartY, width: eqSize, height: eqSize },
            { key: 'armor', label: 'Armad.', x: eqStartX + eqSize + eqGap, y: eqStartY, width: eqSize, height: eqSize },
            { key: 'relic', label: 'Relíq.', x: eqStartX + 2 * (eqSize + eqGap), y: eqStartY, width: eqSize, height: eqSize }
        ];

        this.portraitImage = null;
        this.portraitImageLoaded = false;
        this.portraitImagePath = null;

        // Fundo do inventário (imagem)
        this.bgImage = new Image();
        this.bgImage.loaded = false;
        this.bgImage.src = './assets/sprites/UI/inventario_bg.png';
        this.bgImage.onload = () => { this.bgImage.loaded = true; };
    }

    draw(ctx) {
        // Fundo escuro semi-transparente cobrindo a tela toda
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, this.engine.canvas.width, this.engine.canvas.height);

        // Fundo do inventário
        if (this.bgImage && this.bgImage.loaded) {
            ctx.drawImage(this.bgImage, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = 'rgba(22, 24, 32, 0.95)';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }

        // Textos superiores
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 26px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Inventário', this.x + 40, this.y + 40);

        ctx.font = '16px Arial';
        ctx.fillText(`Fragmentos: ${this.engine.memoryFragments}`, this.x + 40, this.y + 65);
        ctx.fillStyle = '#CCCCCC';
        ctx.fillText('Pressione I para fechar.', this.x + 40, this.y + 85);

        // DESENHANDO O PORTRAIT (ROSTO) E TEXTOS
        this.updatePortraitImage();

        if (this.portraitImageLoaded && this.portraitImage) {
            ctx.drawImage(
                this.portraitImage,
                this.portraitBox.x,
                this.portraitBox.y,
                this.portraitBox.width,
                this.portraitBox.height
            );
        } else {
            ctx.fillStyle = this.engine.selectedCharacter?.color || '#444';
            ctx.fillRect(this.portraitBox.x, this.portraitBox.y, this.portraitBox.width, this.portraitBox.height);
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '18px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Sem Arte', this.portraitBox.x + this.portraitBox.width / 2, this.portraitBox.y + this.portraitBox.height / 2);
            ctx.textAlign = 'left';
        }
        ctx.strokeStyle = '#FFFFFF';
        ctx.strokeRect(this.portraitBox.x, this.portraitBox.y, this.portraitBox.width, this.portraitBox.height);

        // Nome e Classe do Personagem
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 20px Arial';
        const heroName = this.engine.selectedCharacter?.name || 'Desconhecido';
        const heroClass = this.engine.selectedCharacter?.class || 'Sem classe';
        ctx.textAlign = 'center';
        ctx.fillText(heroName, this.portraitBox.x + this.portraitBox.width / 2, this.portraitBox.y + this.portraitBox.height + 30);
        ctx.font = '14px Arial';
        ctx.fillStyle = '#AAAAAA';
        ctx.fillText(heroClass, this.portraitBox.x + this.portraitBox.width / 2, this.portraitBox.y + this.portraitBox.height + 50);

        // SLOTS DE EQUIPAMENTO (Os 3 quadrados pequenos)
        let detailsY = this.equipmentSlots[0].y + this.equipmentSlots[0].height + 25;

        this.equipmentSlots.forEach((slot) => {
            // Desenha a caixinha do equipamento
            ctx.fillStyle = 'rgba(32, 32, 53, 0.8)';
            ctx.fillRect(slot.x, slot.y, slot.width, slot.height);
            ctx.strokeStyle = '#FFFFFF';
            ctx.strokeRect(slot.x, slot.y, slot.width, slot.height);

            // Label em cima da caixinha (ex: Arma, Armad.)
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.font = 'bold 12px Arial';
            ctx.fillText(slot.label, slot.x + slot.width / 2, slot.y + 5);

            const equipped = this.engine.equipment[slot.key];
            if (equipped) {
                // Desenha a cor do item dentro da caixinha
                ctx.fillStyle = '#8D9EFF';
                ctx.fillRect(slot.x + 10, slot.y + 22, slot.width - 20, slot.height - 32);

                ctx.fillStyle = '#000000';
                ctx.textBaseline = 'middle';
                ctx.font = 'bold 10px Arial';
                // Mostra só o comecinho do nome dentro do quadrado pequeno
                ctx.fillText(equipped.name.substring(0, 7) + '..', slot.x + slot.width / 2, slot.y + 22 + (slot.height - 32) / 2);

                // Lista o nome completo do item lá embaixo para o jogador ler
                ctx.fillStyle = '#8D9EFF';
                ctx.textAlign = 'center';
                ctx.font = 'bold 14px Arial';
                ctx.fillText(`[${slot.label}] ${equipped.name}`, this.portraitBox.x + this.portraitBox.width / 2, detailsY);
                detailsY += 20;
            } else {
                ctx.fillStyle = '#AAAAAA';
                ctx.font = '12px Arial';
                ctx.textBaseline = 'middle';
                ctx.fillText('vazio', slot.x + slot.width / 2, slot.y + slot.height / 2 + 5);
            }
            ctx.textAlign = 'left';
            ctx.textBaseline = 'alphabetic';
        });

        // GRADE DE ITENS GERAIS (Quadrados Grandes)
        for (let row = 0; row < this.grid.rows; row += 1) {
            for (let col = 0; col < this.grid.cols; col += 1) {
                const slotX = this.grid.x + col * (this.grid.slotSize + this.grid.gap);
                const slotY = this.grid.y + row * (this.grid.slotSize + this.grid.gap);
                const slotIndex = row * this.grid.cols + col;
                const item = this.engine.inventory[slotIndex];

                ctx.fillStyle = 'rgba(32, 32, 53, 0.8)';
                ctx.fillRect(slotX, slotY, this.grid.slotSize, this.grid.slotSize);
                ctx.strokeStyle = '#555577';
                ctx.strokeRect(slotX, slotY, this.grid.slotSize, this.grid.slotSize);

                if (item) {
                    ctx.fillStyle = '#8D9EFF';
                    ctx.fillRect(slotX + 5, slotY + 5, this.grid.slotSize - 10, this.grid.slotSize - 10);

                    ctx.fillStyle = '#000000';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.font = 'bold 13px Arial';

                    // Quebra o nome em duas linhas se for muito grande
                    const parts = item.name.split(' ');
                    if (parts.length > 1) {
                        ctx.fillText(parts[0], slotX + this.grid.slotSize / 2, slotY + 30, this.grid.slotSize - 15);
                        ctx.fillText(parts[1].substring(0, 10), slotX + this.grid.slotSize / 2, slotY + 45, this.grid.slotSize - 15);
                    } else {
                        ctx.fillText(item.name.substring(0, 12), slotX + this.grid.slotSize / 2, slotY + 35, this.grid.slotSize - 15);
                    }

                    ctx.font = '10px Arial';
                    ctx.fillText(item.type.toUpperCase(), slotX + this.grid.slotSize / 2, slotY + 65, this.grid.slotSize - 15);
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'alphabetic';
                }
            }
        }
    }

    handleInput(mouseX, mouseY) {
        if (!this.isInsideWindow(mouseX, mouseY)) {
            this.engine.closeInventory();
            return;
        }

        const clickedGrid = this.getGridSlot(mouseX, mouseY);
        if (clickedGrid !== null) {
            this.handleGridClick(clickedGrid);
            return;
        }

        const clickedEquipment = this.getEquipmentSlot(mouseX, mouseY);
        if (clickedEquipment) {
            this.unequip(clickedEquipment.key);
        }
    }

    isInsideWindow(mouseX, mouseY) {
        return mouseX >= this.x && mouseX <= this.x + this.width && mouseY >= this.y && mouseY <= this.y + this.height;
    }

    getGridSlot(mouseX, mouseY) {
        for (let row = 0; row < this.grid.rows; row += 1) {
            for (let col = 0; col < this.grid.cols; col += 1) {
                const slotX = this.grid.x + col * (this.grid.slotSize + this.grid.gap);
                const slotY = this.grid.y + row * (this.grid.slotSize + this.grid.gap);
                if (mouseX >= slotX && mouseX <= slotX + this.grid.slotSize && mouseY >= slotY && mouseY <= slotY + this.grid.slotSize) {
                    return row * this.grid.cols + col;
                }
            }
        }
        return null;
    }

    getEquipmentSlot(mouseX, mouseY) {
        return this.equipmentSlots.find((slot) => {
            return mouseX >= slot.x && mouseX <= slot.x + slot.width && mouseY >= slot.y && mouseY <= slot.y + slot.height;
        });
    }

    updatePortraitImage() {
        const portraitPath = this.engine.selectedCharacter?.facePortrait;

        if (!portraitPath) {
            this.portraitImagePath = null;
            this.portraitImage = null;
            this.portraitImageLoaded = false;
            return;
        }

        if (this.portraitImagePath === portraitPath) {
            return;
        }

        this.portraitImagePath = portraitPath;
        this.portraitImageLoaded = false;
        this.portraitImage = new Image();
        this.portraitImage.onload = () => {
            this.portraitImageLoaded = true;
        };
        this.portraitImage.src = portraitPath;
    }

    handleGridClick(index) {
        const item = this.engine.inventory[index];
        if (!item) return;

        if (item.type === 'weapon' || item.type === 'armor' || item.type === 'relic') {
            this.equip(index);
        }
    }

    equip(index) {
        const item = this.engine.inventory[index];
        if (!item) return;

        const slotKey = item.type;
        const current = this.engine.equipment[slotKey];

        this.engine.equipment[slotKey] = item;
        this.engine.inventory[index] = current || null;
    }

    unequip(slotKey) {
        const item = this.engine.equipment[slotKey];
        if (!item) return;

        const emptyIndex = this.engine.inventory.findIndex((slot) => slot === null);
        if (emptyIndex === -1) return;

        this.engine.inventory[emptyIndex] = item;
        this.engine.equipment[slotKey] = null;
    }
}
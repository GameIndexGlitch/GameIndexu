/**
 * Gerencia o carregamento de imagens e spritesheets feitas.
 */
export class AssetLoader {
    constructor() {
        this.assets = new Map();
    }

    // Carrega uma imagem e retorna uma Promise
    loadImage(name, url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                this.assets.set(name, img);
                resolve(img);
            };
            img.onerror = () => reject(`Erro ao carregar asset: ${url}`);
        });
    }

    get(name) {
        return this.assets.get(name);
    }
}
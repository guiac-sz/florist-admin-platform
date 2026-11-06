// Mesmo formato do card da loja (aspect-ratio: 4 / 5 em Catalog.css).
// Se um dia mudar o card, mude aqui também.
export const PRODUCT_IMAGE_ASPECT = 4 / 5;

// Largura final da foto salva (a altura sai do formato: 960 x 1200).
// É suficiente para telas boas sem deixar a loja pesada.
const OUTPUT_WIDTH = 960;

export interface CropArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

function loadImage(src: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("Não foi possível abrir a imagem."));
        image.src = src;
    });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
    return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
}

/**
 * Recorta a parte escolhida da foto e reduz para o tamanho da vitrine.
 * Tudo acontece no navegador: só o resultado (bem mais leve) vai para a API.
 */
export async function cropImage(src: string, area: CropArea): Promise<File> {
    const image = await loadImage(src);

    // Se o recorte for menor que o tamanho final, não aumentamos
    // (aumentar só deixaria a foto borrada e mais pesada).
    const scale = Math.min(1, OUTPUT_WIDTH / area.width);
    const width = Math.round(area.width * scale);
    const height = Math.round(width / PRODUCT_IMAGE_ASPECT);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
        throw new Error("Seu navegador não conseguiu processar a imagem.");
    }

    context.imageSmoothingQuality = "high";

    // drawImage(imagem, origem x, y, largura, altura, destino x, y, largura, altura):
    // pega só o retângulo escolhido e desenha ele no canvas inteiro.
    context.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, width, height);

    // WEBP é bem mais leve que JPG. Alguns navegadores (Safari antigo) não sabem
    // gerar WEBP e devolvem PNG; nesse caso usamos JPG.
    let blob = await canvasToBlob(canvas, "image/webp", 0.85);

    if (!blob || blob.type !== "image/webp") {
        blob = await canvasToBlob(canvas, "image/jpeg", 0.88);
    }

    if (!blob) {
        throw new Error("Seu navegador não conseguiu processar a imagem.");
    }

    const extension = blob.type === "image/webp" ? "webp" : "jpg";

    return new File([blob], `produto.${extension}`, { type: blob.type });
}

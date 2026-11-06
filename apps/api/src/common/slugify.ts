/**
 * Transforma um nome em um "slug": o pedaço de texto usado em endereços.
 * Exemplo: "Buquês & Flores" → "buques-flores"
 */
export function slugify(text: string) {
  return text
    .normalize('NFD') // separa as letras dos acentos ("ê" vira "e" + "^")
    .replace(/[̀-ͯ]/g, '') // remove os acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // tudo que não é letra ou número vira "-"
    .replace(/^-+|-+$/g, ''); // tira "-" do começo e do fim
}

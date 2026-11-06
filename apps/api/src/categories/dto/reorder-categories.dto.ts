import { ArrayNotEmpty, ArrayUnique, IsArray, IsInt } from 'class-validator';

export class ReorderCategoriesDto {
  /** Ids das categorias na nova ordem dos filtros da loja. Exemplo: [2, 1, 3] */
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique({ message: 'A lista tem categorias repetidas.' })
  @IsInt({ each: true })
  ids: number[];
}

import { ArrayNotEmpty, ArrayUnique, IsArray, IsInt } from 'class-validator';

export class ReorderProductsDto {
  /** Ids dos produtos na nova ordem da vitrine. Exemplo: [3, 1, 2] */
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique({ message: 'A lista tem produtos repetidos.' })
  @IsInt({ each: true })
  ids: number[];
}

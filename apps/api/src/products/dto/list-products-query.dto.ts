import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ListProductsQueryDto {
  /** Slug da categoria. Exemplo: rosas */
  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;

  /** Texto buscado no nome, na descrição e na categoria do produto */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;
}
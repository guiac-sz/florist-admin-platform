import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SaveCategoryDto {
  /** Nome que aparece nos filtros da loja. Exemplo: Orquídeas */
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty({ message: 'Informe o nome da categoria.' })
  @MaxLength(40, { message: 'Use no máximo 40 caracteres.' })
  name: string;
}

import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateProductDto {
  /** Exemplo: Buquê Aurora */
  @Transform(trim)
  @IsString()
  @IsNotEmpty({ message: 'Informe o nome do produto.' })
  @MaxLength(120)
  name: string;

  /** Texto que aparece no card e nos detalhes do produto */
  @Transform(trim)
  @IsString()
  @IsNotEmpty({ message: 'Escreva uma descrição.' })
  @MaxLength(600)
  description: string;

  /** Preço em reais, com até 2 casas decimais. Exemplo: 149.9 */
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Informe um preço válido, com até 2 casas decimais.' },
  )
  @Min(0.01, { message: 'O preço precisa ser maior que zero.' })
  price: number;

  /** Endereço da foto do produto */
  @IsUrl({}, { message: 'Informe um endereço de imagem válido.' })
  imageUrl: string;

  /** Id da categoria */
  @IsInt({ message: 'Escolha uma categoria.' })
  categoryId: number;

  /** false = esgotado (continua visível, com "Encomendar pelo WhatsApp") */
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  /** false = escondido da loja */
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  /** true = etiqueta "Destaque" */
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}

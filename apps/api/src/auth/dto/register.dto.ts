import { Transform } from 'class-transformer';
import {
  Equals,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  /** Nome completo. Exemplo: Ana Carolina Souza */
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty({ message: 'Informe seu nome.' })
  @MaxLength(120)
  name: string;

  /** E-mail usado para entrar. Exemplo: ana@email.com */
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail({}, { message: 'Digite um e-mail válido.' })
  @MaxLength(160)
  email: string;

  /** Celular com DDD, só números. Exemplo: 15990000000 */
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.replace(/\D/g, '') : value,
  )
  @IsOptional()
  @Matches(/^\d{10,11}$/, { message: 'Digite um celular com DDD.' })
  phone?: string;

  /** Mínimo de 8 caracteres, com letras e números */
  @IsString()
  @MinLength(8, { message: 'A senha precisa ter pelo menos 8 caracteres.' })
  @MaxLength(72)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
    message: 'A senha precisa ter letras e números.',
  })
  password: string;

  /** Precisa ser true: aceite dos termos de uso e da política de privacidade */
  @Equals(true, { message: 'É preciso aceitar os termos de uso.' })
  acceptsTerms: boolean;

  /** Quer receber novidades por e-mail */
  @IsOptional()
  @IsBoolean()
  acceptsMarketing?: boolean;
}

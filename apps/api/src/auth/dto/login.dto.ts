import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  /** Exemplo: ana@email.com */
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail({}, { message: 'Digite um e-mail válido.' })
  email: string;

  /** Exemplo: flores123 */
  @IsString()
  @IsNotEmpty({ message: 'Informe sua senha.' })
  password: string;
}

import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ResetTokenDto {
  /** Código que veio no link do e-mail */
  @IsString()
  @IsNotEmpty({ message: 'Link inválido.' })
  @MaxLength(100)
  token: string;
}

export class ResetPasswordDto extends ResetTokenDto {
  /** Nova senha: mínimo de 8 caracteres, com letras e números */
  @IsString()
  @MinLength(8, { message: 'A senha precisa ter pelo menos 8 caracteres.' })
  @MaxLength(72)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
    message: 'A senha precisa ter letras e números.',
  })
  password: string;
}

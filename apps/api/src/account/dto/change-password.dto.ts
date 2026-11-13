import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ChangePasswordDto {
  /** Senha usada hoje para entrar */
  @IsString()
  @IsNotEmpty({ message: 'Informe sua senha atual.' })
  currentPassword: string;

  /** Mínimo de 8 caracteres, com letras e números */
  @IsString()
  @MinLength(8, {
    message: 'A nova senha precisa ter pelo menos 8 caracteres.',
  })
  @MaxLength(72)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
    message: 'A nova senha precisa ter letras e números.',
  })
  newPassword: string;
}

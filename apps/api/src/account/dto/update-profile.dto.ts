import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { IsCpf } from '../../common/validators/is-cpf';

export class UpdateProfileDto {
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
  @IsString({ message: 'Informe o celular com DDD.' })
  @Matches(/^\d{10,11}$/, { message: 'Informe o celular com DDD.' })
  phone: string;

  /**
   * CPF, opcional. Vazio ou null apaga o CPF salvo.
   * Exemplo: 52998224725
   */
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value !== 'string') return value;
    const digits = value.replace(/\D/g, '');
    return digits === '' ? null : digits;
  })
  @IsOptional()
  @IsCpf()
  cpf?: string | null;

  /** Quer receber novidades por e-mail */
  @IsBoolean()
  acceptsMarketing: boolean;

  /**
   * Senha atual. Só é obrigatória para trocar o e-mail: quem pegar o
   * celular de alguém logado não consegue "roubar" a conta trocando o e-mail.
   */
  @ValidateIf((dto: UpdateProfileDto) => dto.currentPassword !== undefined)
  @IsString()
  currentPassword?: string;
}

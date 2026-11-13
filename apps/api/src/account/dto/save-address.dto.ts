import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

// prettier-ignore
export const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

// Tira espaços das pontas; texto vazio vira null (campo "apagado").
const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

const trimOrNull = ({ value }: { value: unknown }) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
};

export class SaveAddressDto {
  /** Apelido do endereço. Exemplo: Casa */
  @Transform(trim)
  @IsString()
  @IsNotEmpty({ message: 'Dê um nome para o endereço, como "Casa".' })
  @MaxLength(30, { message: 'Use no máximo 30 caracteres no nome.' })
  label: string;

  /** CEP, com ou sem traço. Exemplo: 18030-000 */
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.replace(/\D/g, '') : value,
  )
  @IsString()
  @Matches(/^\d{8}$/, { message: 'Informe um CEP com 8 números.' })
  zipCode: string;

  /** Rua ou avenida. Exemplo: Rua das Hortênsias */
  @Transform(trim)
  @IsString()
  @IsNotEmpty({ message: 'Informe a rua.' })
  @MaxLength(120)
  street: string;

  /** Número. Exemplo: 210 (aceita "s/n") */
  @Transform(trim)
  @IsString()
  @IsNotEmpty({ message: 'Informe o número (ou "s/n").' })
  @MaxLength(10)
  number: string;

  /** Apartamento, bloco... Exemplo: ap. 32 */
  @Transform(trimOrNull)
  @IsOptional()
  @IsString()
  @MaxLength(60)
  complement?: string | null;

  /** Bairro. Exemplo: Jardim Vergueiro */
  @Transform(trim)
  @IsString()
  @IsNotEmpty({ message: 'Informe o bairro.' })
  @MaxLength(80)
  neighborhood: string;

  /** Cidade. Exemplo: Sorocaba */
  @Transform(trim)
  @IsString()
  @IsNotEmpty({ message: 'Informe a cidade.' })
  @MaxLength(80)
  city: string;

  /** Sigla do estado. Exemplo: SP */
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsIn(BRAZILIAN_STATES, { message: 'Escolha o estado.' })
  state: string;

  /** Ponto de referência para o entregador. Exemplo: portão verde */
  @Transform(trimOrNull)
  @IsOptional()
  @IsString()
  @MaxLength(120)
  reference?: string | null;

  /** Usar como endereço principal */
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

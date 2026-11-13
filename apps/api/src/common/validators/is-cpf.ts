import { registerDecorator, type ValidationOptions } from 'class-validator';

/**
 * Confere os dois dígitos verificadores do CPF (os dois últimos números).
 * Eles são calculados a partir dos 9 primeiros, então um CPF digitado
 * errado quase sempre falha aqui.
 */
export function isValidCpf(value: string) {
  const digits = value.replace(/\D/g, '');

  // 11 números, e não todos iguais (111.111.111-11 passa na conta, mas é inválido)
  if (!/^\d{11}$/.test(digits) || /^(\d)\1{10}$/.test(digits)) {
    return false;
  }

  const numbers = digits.split('').map(Number);

  for (const position of [9, 10]) {
    let sum = 0;

    for (let index = 0; index < position; index++) {
      sum += numbers[index] * (position + 1 - index);
    }

    const checkDigit = ((sum * 10) % 11) % 10;

    if (checkDigit !== numbers[position]) {
      return false;
    }
  }

  return true;
}

/** Decorator para usar nos DTOs: @IsCpf() */
export function IsCpf(options?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCpf',
      target: object.constructor,
      propertyName,
      options: { message: 'CPF inválido. Confira os números.', ...options },
      validator: {
        validate: (value: unknown) =>
          typeof value === 'string' && isValidCpf(value),
      },
    });
  };
}

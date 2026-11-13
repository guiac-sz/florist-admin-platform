import type { User } from '../generated/prisma/client';
import type { AuthUser } from './auth.types';

/**
 * O que a API devolve sobre um usuário. Escolhemos os campos um a um
 * para nunca mandar o passwordHash para o navegador.
 */
export function toAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    cpf: user.cpf,
    acceptsMarketing: user.acceptsMarketing,
    role: user.role,
  };
}

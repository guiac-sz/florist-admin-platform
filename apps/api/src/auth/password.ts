import { compare, hash } from 'bcryptjs';

// Quanto maior, mais lento (e mais difícil de quebrar por força bruta).
const PASSWORD_SALT_ROUNDS = 10;

export function hashPassword(password: string) {
  return hash(password, PASSWORD_SALT_ROUNDS);
}

export function verifyPassword(password: string, passwordHash: string) {
  return compare(password, passwordHash);
}

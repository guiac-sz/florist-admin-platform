import type { Role } from '../generated/prisma/client';

export interface JwtPayload {
  sub: number;
  role: Role;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  cpf: string | null;
  acceptsMarketing: boolean;
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

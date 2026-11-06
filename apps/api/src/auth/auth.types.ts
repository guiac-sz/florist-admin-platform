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
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { User } from '../generated/prisma/client';
import { UsersService } from '../users/users.service';
import { toAuthUser } from './auth-user';
import type { AuthResponse, AuthUser, JwtPayload } from './auth.types';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { hashPassword, verifyPassword } from './password';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Este e-mail já está cadastrado.');
    }

    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      passwordHash: await hashPassword(dto.password),
      acceptsMarketing: dto.acceptsMarketing ?? false,
    });

    return this.createSession(user);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(dto.email);
    const isPasswordValid =
      user !== null && (await verifyPassword(dto.password, user.passwordHash));

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    return this.createSession(user);
  }

  async getProfile(userId: number): Promise<AuthUser> {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('Sessão inválida. Entre novamente.');
    }

    return toAuthUser(user);
  }

  private async createSession(user: User): Promise<AuthResponse> {
    const payload: JwtPayload = { sub: user.id, role: user.role };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: toAuthUser(user),
    };
  }
}

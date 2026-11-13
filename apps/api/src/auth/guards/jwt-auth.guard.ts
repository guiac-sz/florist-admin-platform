import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import type { JwtPayload } from '../auth.types';

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayload }>();

    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Faça login para continuar.');
    }

    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Sessão expirada. Entre novamente.');
    }

    // O token pode ser válido e mesmo assim não servir mais: se a senha foi
    // trocada depois que ele foi criado, a sessionVersion do usuário subiu.
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { role: true, sessionVersion: true },
    });

    if (!user || (payload.ver ?? 0) !== user.sessionVersion) {
      throw new UnauthorizedException(
        'Sua sessão foi encerrada. Entre novamente.',
      );
    }

    // O perfil vem do banco (e não do token): se uma admin deixar de ser
    // admin, isso vale na hora, sem esperar o token vencer.
    request.user = { ...payload, role: user.role };

    return true;
  }
}

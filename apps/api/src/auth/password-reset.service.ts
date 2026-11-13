import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { hashPassword } from './password';

const TOKEN_TTL_MINUTES = 30;
const INVALID_LINK_MESSAGE = 'Este link expirou ou já foi usado.';

/**
 * O código vai no link do e-mail; no banco fica só o hash (SHA-256).
 * Assim, mesmo quem tiver acesso ao banco não consegue usar os links.
 * (Aqui não precisa de bcrypt: o código já é aleatório e longo.)
 */
function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

@Injectable()
export class PasswordResetService {
  private readonly logger = new Logger(PasswordResetService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Sempre "dá certo" para quem chamou, exista a conta ou não. Se a resposta
   * mudasse, qualquer pessoa descobriria quais e-mails têm conta na loja.
   */
  async requestReset(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return;
    }

    // 32 bytes aleatórios → ~43 caracteres seguros para URL.
    const token = randomBytes(32).toString('base64url');

    await this.prisma.$transaction([
      // Pedir um link novo invalida os anteriores ainda não usados.
      this.prisma.passwordResetToken.deleteMany({
        where: { userId: user.id, usedAt: null },
      }),
      this.prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash: hashToken(token),
          expiresAt: new Date(Date.now() + TOKEN_TTL_MINUTES * 60_000),
        },
      }),
    ]);

    const webUrl = process.env.WEB_URL ?? 'http://localhost:5173';
    const link = `${webUrl}/criar-nova-senha?token=${token}`;

    // Sem "await": a resposta sai no mesmo tempo, exista a conta ou não
    // (esperar o envio deixaria a resposta mais lenta só quando existe).
    this.mailService
      .sendPasswordReset({
        to: user.email,
        name: user.name,
        link,
        expiresInMinutes: TOKEN_TTL_MINUTES,
      })
      .catch((error: unknown) => {
        this.logger.error(
          `Não foi possível enviar o e-mail de nova senha: ${String(error)}`,
        );
      });
  }

  /** Só confere se o link ainda vale (a tela usa para mostrar "Link expirado"). */
  async checkToken(token: string) {
    await this.findValidTokenOrFail(token);
  }

  async resetPassword(token: string, password: string) {
    const resetToken = await this.findValidTokenOrFail(token);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: resetToken.userId },
        data: {
          passwordHash: await hashPassword(password),
          // Encerra todas as sessões abertas com a senha antiga.
          sessionVersion: { increment: 1 },
        },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
    ]);
  }

  private async findValidTokenOrFail(token: string) {
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash: hashToken(token) },
    });

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
      throw new BadRequestException(INVALID_LINK_MESSAGE);
    }

    return resetToken;
  }
}

import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { toAuthUser } from '../auth/auth-user';
import { hashPassword, verifyPassword } from '../auth/password';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AccountService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    const user = await this.findUserOrFail(userId);

    if (dto.email !== user.email) {
      // Trocar o e-mail é trocar o "login": pedimos a senha para confirmar.
      if (!dto.currentPassword) {
        throw new BadRequestException(
          'Confirme sua senha atual para trocar o e-mail.',
        );
      }

      await this.ensurePassword(dto.currentPassword, user.passwordHash);

      const emailOwner = await this.usersService.findByEmail(dto.email);

      if (emailOwner) {
        throw new ConflictException(
          'Este e-mail já está em uso em outra conta.',
        );
      }
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        cpf: dto.cpf ?? null,
        acceptsMarketing: dto.acceptsMarketing,
      },
    });

    return toAuthUser(updated);
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.findUserOrFail(userId);

    await this.ensurePassword(dto.currentPassword, user.passwordHash);

    if (await verifyPassword(dto.newPassword, user.passwordHash)) {
      throw new BadRequestException(
        'A nova senha precisa ser diferente da atual.',
      );
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: await hashPassword(dto.newPassword) },
    });
  }

  private async findUserOrFail(userId: number) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('Sessão inválida. Entre novamente.');
    }

    return user;
  }

  /**
   * Senha errada aqui é 400, e não 401: a pessoa continua logada,
   * só digitou a senha atual errado (401 faria o site deslogar).
   */
  private async ensurePassword(password: string, passwordHash: string) {
    if (!(await verifyPassword(password, passwordHash))) {
      throw new BadRequestException('Senha atual incorreta.');
    }
  }
}

import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { JwtPayload } from '../auth/auth.types';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AccountService } from './account.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

// Tudo aqui age sobre a conta de quem está logado (o id vem do token,
// nunca da URL): um cliente não consegue alterar a conta de outro.
@ApiTags('Minha conta')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  /** Atualiza nome, e-mail, celular, CPF e preferência de e-mails */
  @Patch('profile')
  updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.accountService.updateProfile(user.sub, dto);
  }

  /**
   * Troca a senha (pede a senha atual). Encerra as sessões nos outros
   * aparelhos e devolve um token novo para quem fez a troca.
   */
  @Patch('password')
  changePassword(
    @CurrentUser() user: JwtPayload,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.accountService.changePassword(user.sub, dto);
  }
}

import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import type { JwtPayload } from './auth.types';
import { CurrentUser } from './decorators/current-user.decorator';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto, ResetTokenDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PasswordResetService } from './password-reset.service';

// ThrottlerGuard: limita quantas vezes o mesmo IP chama estas rotas.
// O padrão (AppModule) vale para todas; as mais sensíveis têm limite menor.
@ApiTags('Autenticação')
@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly passwordResetService: PasswordResetService,
  ) {}

  /** Cria uma conta de cliente e já devolve a sessão */
  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /** Entra com e-mail e senha (no máximo 5 tentativas por minuto) */
  @Post('login')
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /** Dados de quem está logado (precisa do token) */
  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: JwtPayload) {
    return this.authService.getProfile(user.sub);
  }

  /**
   * Envia o link de nova senha. Responde igual exista a conta ou não.
   * Limite: 3 pedidos a cada 15 minutos.
   */
  @Post('forgot-password')
  @HttpCode(204)
  @Throttle({ default: { limit: 3, ttl: 15 * 60_000 } })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.passwordResetService.requestReset(dto.email);
  }

  /** Confere se o link de nova senha ainda vale (204) ou expirou (400) */
  @Post('reset-password/check')
  @HttpCode(204)
  checkResetToken(@Body() dto: ResetTokenDto) {
    return this.passwordResetService.checkToken(dto.token);
  }

  /** Salva a nova senha e encerra as sessões abertas */
  @Post('reset-password')
  @HttpCode(204)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.passwordResetService.resetPassword(dto.token, dto.password);
  }
}

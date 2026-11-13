import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UploadsModule } from './uploads/uploads.module';
import { AccountModule } from './account/account.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    // Limite padrão das rotas que usam o ThrottlerGuard (hoje, as de login):
    // 30 chamadas por minuto por IP. Cada rota pode pedir um limite menor.
    ThrottlerModule.forRoot({
      throttlers: [{ name: 'default', ttl: 60_000, limit: 30 }],
      errorMessage:
        'Muitas tentativas seguidas. Aguarde um pouco e tente de novo.',
    }),
    MailModule,
    PrismaModule,
    CategoriesModule,
    ProductsModule,
    UsersModule,
    AuthModule,
    UploadsModule,
    AccountModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

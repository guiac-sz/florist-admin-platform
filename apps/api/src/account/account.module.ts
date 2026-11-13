import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [AccountController, AddressesController],
  providers: [AccountService, AddressesService],
})
export class AccountModule {}

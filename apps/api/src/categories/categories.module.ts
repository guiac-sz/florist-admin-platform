import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AdminCategoriesController } from './admin-categories.controller';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  imports: [AuthModule],
  providers: [CategoriesService],
  controllers: [CategoriesController, AdminCategoriesController],
})
export class CategoriesModule {}

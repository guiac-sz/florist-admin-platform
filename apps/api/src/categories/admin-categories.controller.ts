import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminOnly } from '../auth/decorators/admin-only.decorator';
import { CategoriesService } from './categories.service';
import { ReorderCategoriesDto } from './dto/reorder-categories.dto';
import { SaveCategoryDto } from './dto/save-category.dto';

@ApiTags('Administração · Categorias')
@AdminOnly()
@Controller('admin/categories')
export class AdminCategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /** Todas as categorias, com a quantidade de produtos de cada uma */
  @Get()
  findAll() {
    return this.categoriesService.findAllForAdmin();
  }

  /** Salva a nova ordem dos filtros da loja */
  @Put('order')
  @HttpCode(204)
  reorder(@Body() dto: ReorderCategoriesDto) {
    return this.categoriesService.reorder(dto);
  }

  /** Cria uma categoria (entra no fim da lista) */
  @Post()
  create(@Body() dto: SaveCategoryDto) {
    return this.categoriesService.create(dto);
  }

  /** Renomeia a categoria */
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: SaveCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  /** Exclui a categoria (só se ela não tiver produtos) */
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}

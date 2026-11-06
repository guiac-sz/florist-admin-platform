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
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ReorderProductsDto } from './dto/reorder-products.dto';
import { ProductsService } from './products.service';

@ApiTags('Administração · Produtos')
@AdminOnly()
@Controller('admin/products')
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /** Todos os produtos, inclusive os escondidos da loja */
  @Get()
  findAll() {
    return this.productsService.findAllForAdmin();
  }

  /** Salva a nova ordem da vitrine */
  @Put('order')
  @HttpCode(204)
  reorder(@Body() dto: ReorderProductsDto) {
    return this.productsService.reorder(dto);
  }

  /** Um produto, mesmo escondido */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOneForAdmin(id);
  }

  /** Cadastra um produto novo (entra no fim da vitrine) */
  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  /** Altera só os campos enviados */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, dto);
  }

  /** Exclui o produto */
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}

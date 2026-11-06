import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ListProductsQueryDto } from './dto/list-products-query.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ReorderProductsDto } from './dto/reorder-products.dto';

const productInclude = {
  category: {
    select: { id: true, name: true, slug: true },
  },
} as const;

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll({ category, search }: ListProductsQueryDto) {
    return this.prisma.product.findMany({
      where: {
        isVisible: true,
        category: category ? { slug: category } : undefined,
        OR: search
          ? [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { category: { name: { contains: search, mode: 'insensitive' } } },
            ]
          : undefined,
      },
      orderBy: { sortOrder: 'asc' },
      include: productInclude,
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findFirst({
      where: { id, isVisible: true },
      include: productInclude,
    });

    if (!product) {
      throw new NotFoundException(`Produto ${id} não encontrado`);
    }

    return product;
  }

  // ----- Administração -----

  findAllForAdmin() {
    return this.prisma.product.findMany({
      orderBy: { sortOrder: 'asc' },
      include: productInclude,
    });
  }

  async findOneForAdmin(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: productInclude,
    });

    if (!product) {
      throw new NotFoundException(`Produto ${id} não encontrado`);
    }

    return product;
  }

  async create(dto: CreateProductDto) {
    await this.ensureCategoryExists(dto.categoryId);

    const last = await this.prisma.product.findFirst({
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });

    return this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        imageUrl: dto.imageUrl,
        categoryId: dto.categoryId,
        isAvailable: dto.isAvailable,
        isVisible: dto.isVisible,
        isFeatured: dto.isFeatured,
        sortOrder: (last?.sortOrder ?? 0) + 1,
      },
      include: productInclude,
    });
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findOneForAdmin(id);

    if (dto.categoryId !== undefined) {
      await this.ensureCategoryExists(dto.categoryId);
    }

    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: productInclude,
    });
  }

  async reorder({ ids }: ReorderProductsDto) {
    const count = await this.prisma.product.count({
      where: { id: { in: ids } },
    });

    if (count !== ids.length) {
      throw new BadRequestException('A lista tem produtos que não existem.');
    }

    // SQL direto (com parâmetros) para mudar só a ordem, sem mexer na
    // data de "atualizado em" de todos os produtos.
    await this.prisma.$transaction(
      ids.map(
        (id, index) =>
          this.prisma.$executeRaw`UPDATE "products" SET "sortOrder" = ${index + 1} WHERE "id" = ${id}`,
      ),
    );
  }

  async remove(id: number) {
    await this.findOneForAdmin(id);
    await this.prisma.product.delete({ where: { id } });
  }

  private async ensureCategoryExists(categoryId: number) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new BadRequestException('Categoria não encontrada.');
    }
  }
}

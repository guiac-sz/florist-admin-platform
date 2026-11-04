import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ListProductsQueryDto } from './dto/list-products-query.dto';

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
}
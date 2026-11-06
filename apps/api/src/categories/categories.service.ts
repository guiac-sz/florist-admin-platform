import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { slugify } from '../common/slugify';
import { PrismaService } from '../prisma/prisma.service';
import { ReorderCategoriesDto } from './dto/reorder-categories.dto';
import { SaveCategoryDto } from './dto/save-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  /** Loja: só categorias com pelo menos um produto visível (sem filtro vazio). */
  findAll() {
    return this.prisma.category.findMany({
      where: { products: { some: { isVisible: true } } },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, name: true, slug: true },
    });
  }

  /** Painel: todas as categorias, com a quantidade de produtos de cada uma. */
  async findAllForAdmin() {
    const categories = await this.prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { products: true } } },
    });

    return categories.map(({ _count, ...category }) => ({
      ...category,
      productCount: _count.products,
    }));
  }

  async create({ name }: SaveCategoryDto) {
    const slug = await this.ensureAvailable(name);

    const last = await this.prisma.category.findFirst({
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });

    const category = await this.prisma.category.create({
      data: { name, slug, sortOrder: (last?.sortOrder ?? 0) + 1 },
    });

    return { ...category, productCount: 0 };
  }

  async update(id: number, { name }: SaveCategoryDto) {
    await this.findOneOrFail(id);

    const slug = await this.ensureAvailable(name, id);

    const category = await this.prisma.category.update({
      where: { id },
      data: { name, slug },
      include: { _count: { select: { products: true } } },
    });

    const { _count, ...rest } = category;
    return { ...rest, productCount: _count.products };
  }

  async remove(id: number) {
    const category = await this.findOneOrFail(id);

    // Proteção: um produto sempre precisa de uma categoria. Se apagássemos
    // esta, os produtos dela ficariam "órfãos" (o banco nem deixaria).
    const productCount = await this.prisma.product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      const produtos =
        productCount === 1 ? '1 produto' : `${productCount} produtos`;
      const mova = productCount === 1 ? 'Mova-o' : 'Mova-os';

      throw new ConflictException(
        `"${category.name}" tem ${produtos}. ${mova} para outra categoria antes de excluir.`,
      );
    }

    await this.prisma.category.delete({ where: { id } });
  }

  async reorder({ ids }: ReorderCategoriesDto) {
    const found = await this.prisma.category.count({
      where: { id: { in: ids } },
    });

    if (found !== ids.length) {
      throw new BadRequestException('A lista tem categorias que não existem.');
    }

    await this.prisma.$transaction(
      ids.map((id, index) =>
        this.prisma.category.update({
          where: { id },
          data: { sortOrder: index + 1 },
        }),
      ),
    );
  }

  private async findOneOrFail(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    return category;
  }

  /**
   * Gera o slug e confere se não existe outra categoria com o mesmo nome
   * ("Rosas" e "rosas" contam como iguais, porque geram o mesmo slug).
   */
  private async ensureAvailable(name: string, ignoreId?: number) {
    const slug = slugify(name);

    if (!slug) {
      throw new BadRequestException(
        'Use letras ou números no nome da categoria.',
      );
    }

    const existing = await this.prisma.category.findFirst({
      where: {
        OR: [{ slug }, { name: { equals: name, mode: 'insensitive' } }],
        NOT: ignoreId ? { id: ignoreId } : undefined,
      },
    });

    if (existing) {
      throw new ConflictException(`Já existe a categoria "${existing.name}".`);
    }

    return slug;
  }
}

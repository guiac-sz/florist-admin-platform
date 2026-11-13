import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaveAddressDto } from './dto/save-address.dto';

/**
 * Os campos opcionais vão sempre explícitos: no Prisma, "undefined" quer
 * dizer "não mexa", então um complemento apagado precisa virar null.
 */
function toAddressData({ isDefault: _isDefault, ...data }: SaveAddressDto) {
  return {
    ...data,
    complement: data.complement ?? null,
    reference: data.reference ?? null,
  };
}

@Injectable()
export class AddressesService {
  constructor(private readonly prisma: PrismaService) {}

  /** Principal primeiro, depois do mais antigo para o mais novo. */
  findAll(userId: number) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
      omit: { userId: true },
    });
  }

  async create(userId: number, dto: SaveAddressDto) {
    // O primeiro endereço da conta já nasce como principal.
    const count = await this.prisma.address.count({ where: { userId } });
    const makeDefault = dto.isDefault === true || count === 0;

    return this.prisma.$transaction(async (tx) => {
      if (makeDefault) {
        await tx.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }

      return tx.address.create({
        data: { ...toAddressData(dto), userId, isDefault: makeDefault },
        omit: { userId: true },
      });
    });
  }

  async update(userId: number, id: number, dto: SaveAddressDto) {
    const address = await this.findOwnedOrFail(userId, id);

    // Desmarcar o principal não é permitido: sempre precisa existir um.
    // Para trocar, marca-se outro como principal.
    const makeDefault = address.isDefault || dto.isDefault === true;

    return this.prisma.$transaction(async (tx) => {
      if (makeDefault && !address.isDefault) {
        await tx.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }

      return tx.address.update({
        where: { id },
        data: { ...toAddressData(dto), isDefault: makeDefault },
        omit: { userId: true },
      });
    });
  }

  async setDefault(userId: number, id: number) {
    await this.findOwnedOrFail(userId, id);

    // Transação: as duas mudanças acontecem juntas ou nenhuma acontece,
    // então nunca ficam dois (ou zero) endereços principais.
    await this.prisma.$transaction([
      this.prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      }),
      this.prisma.address.update({
        where: { id },
        data: { isDefault: true },
      }),
    ]);

    return this.findAll(userId);
  }

  async remove(userId: number, id: number) {
    const address = await this.findOwnedOrFail(userId, id);

    await this.prisma.$transaction(async (tx) => {
      await tx.address.delete({ where: { id } });

      // Apagou o principal? O mais antigo que sobrou vira o novo principal.
      if (address.isDefault) {
        const next = await tx.address.findFirst({
          where: { userId },
          orderBy: { createdAt: 'asc' },
        });

        if (next) {
          await tx.address.update({
            where: { id: next.id },
            data: { isDefault: true },
          });
        }
      }
    });
  }

  /**
   * Busca pelo id E pelo dono. Se o endereço for de outra pessoa,
   * respondemos 404 (como se não existisse), sem revelar que existe.
   */
  private async findOwnedOrFail(userId: number, id: number) {
    const address = await this.prisma.address.findFirst({
      where: { id, userId },
    });

    if (!address) {
      throw new NotFoundException('Endereço não encontrado.');
    }

    return address;
  }
}

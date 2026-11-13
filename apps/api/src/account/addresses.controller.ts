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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { JwtPayload } from '../auth/auth.types';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddressesService } from './addresses.service';
import { SaveAddressDto } from './dto/save-address.dto';

@ApiTags('Minha conta')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('account/addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  /** Endereços de quem está logado (o principal vem primeiro) */
  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.addressesService.findAll(user.sub);
  }

  /** Cadastra um endereço (o primeiro vira principal) */
  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() dto: SaveAddressDto) {
    return this.addressesService.create(user.sub, dto);
  }

  /** Altera um endereço */
  @Put(':id')
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SaveAddressDto,
  ) {
    return this.addressesService.update(user.sub, id, dto);
  }

  /** Marca como principal e devolve a lista atualizada */
  @Patch(':id/default')
  setDefault(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.addressesService.setDefault(user.sub, id);
  }

  /** Exclui um endereço */
  @Delete(':id')
  @HttpCode(204)
  remove(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.addressesService.remove(user.sub, id);
  }
}

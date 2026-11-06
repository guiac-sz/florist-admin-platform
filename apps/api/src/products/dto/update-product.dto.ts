import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

/** Todos os campos do cadastro, mas opcionais: envie só o que mudou */
export class UpdateProductDto extends PartialType(CreateProductDto) {}

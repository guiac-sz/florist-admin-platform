import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { randomUUID } from 'node:crypto';
import type { Request } from 'express';
import { diskStorage } from 'multer';
import { AdminOnly } from '../auth/decorators/admin-only.decorator';
import {
  IMAGE_EXTENSIONS,
  MAX_IMAGE_SIZE,
  UPLOADS_DIR,
} from './uploads.constants';

@ApiTags('Administração · Arquivos')
@AdminOnly()
@Controller('admin/uploads')
export class UploadsController {
  /** Envia uma foto (JPG, PNG ou WEBP, até 5 MB) e devolve o endereço dela */
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: UPLOADS_DIR,
        filename: (_request, file, callback) => {
          callback(null, `${randomUUID()}${IMAGE_EXTENSIONS[file.mimetype]}`);
        },
      }),
      limits: { fileSize: MAX_IMAGE_SIZE },
      fileFilter: (_request, file, callback) => {
        if (IMAGE_EXTENSIONS[file.mimetype]) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException('Envie uma imagem JPG, PNG ou WEBP.'),
            false,
          );
        }
      },
    }),
  )
  upload(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Req() request: Request,
  ) {
    if (!file) {
      throw new BadRequestException('Escolha uma imagem para enviar.');
    }

    return {
      url: `${request.protocol}://${request.get('host')}/uploads/${file.filename}`,
    };
  }
}

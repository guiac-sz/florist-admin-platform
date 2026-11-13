import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';

// Global: qualquer módulo pode usar o MailService sem importar este módulo.
@Global()
@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}

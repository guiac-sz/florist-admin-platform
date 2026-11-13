import { Injectable, Logger } from '@nestjs/common';
import { createTransport, type Transporter } from 'nodemailer';

interface PasswordResetEmail {
  to: string;
  name: string;
  link: string;
  expiresInMinutes: number;
}

// Evita que um nome com "<" ou "&" quebre (ou injete código) no HTML do e-mail.
function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  // Em desenvolvimento, o SMTP é o Mailpit (Docker): ele "segura" os e-mails
  // e mostra numa caixa de entrada em http://localhost:8025, sem enviar nada.
  private readonly transporter: Transporter = createTransport({
    host: process.env.SMTP_HOST ?? 'localhost',
    port: Number(process.env.SMTP_PORT ?? 1025),
    secure: false,
  });

  private readonly from =
    process.env.MAIL_FROM ?? 'Ateliê Flora <nao-responda@ateliefora.com>';

  async sendPasswordReset({
    to,
    name,
    link,
    expiresInMinutes,
  }: PasswordResetEmail) {
    const firstName = escapeHtml(name.split(' ')[0]);

    await this.transporter.sendMail({
      from: this.from,
      to,
      subject: 'Crie uma nova senha · Ateliê Flora',
      // Versão em texto puro, para quem não abre HTML.
      text:
        `Olá, ${name.split(' ')[0]}!\n\n` +
        `Recebemos um pedido para criar uma nova senha na sua conta do Ateliê Flora.\n` +
        `Abra o link abaixo (ele vale por ${expiresInMinutes} minutos e só pode ser usado uma vez):\n\n` +
        `${link}\n\n` +
        `Se não foi você, ignore este e-mail: sua senha continua a mesma.`,
      html: `
        <div style="background:#fffaf7;padding:32px 16px;font-family:Arial,sans-serif;color:#332823">
          <div style="max-width:480px;margin:0 auto;background:#ffffff;border:1px solid #eadfd8;border-radius:16px;padding:32px">
            <p style="margin:0 0 24px;font-family:Georgia,serif;font-size:20px;color:#29483a">Ateliê Flora</p>
            <h1 style="margin:0 0 12px;font-family:Georgia,serif;font-weight:400;font-size:26px;color:#2f3d35">Crie uma nova senha</h1>
            <p style="margin:0 0 20px;line-height:1.5;color:#776960">
              Olá, ${firstName}! Recebemos um pedido para criar uma nova senha na sua conta.
              O botão abaixo vale por ${expiresInMinutes} minutos e só pode ser usado uma vez.
            </p>
            <a href="${link}" style="display:inline-block;background:#29483a;color:#ffffff;text-decoration:none;font-weight:bold;padding:14px 24px;border-radius:999px">
              Criar nova senha
            </a>
            <p style="margin:24px 0 0;font-size:13px;line-height:1.5;color:#a3958c">
              Se não foi você, ignore este e-mail: sua senha continua a mesma.
            </p>
          </div>
        </div>`,
    });

    this.logger.log(`E-mail de nova senha enviado para ${to}`);
  }
}

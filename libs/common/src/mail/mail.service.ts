import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(
    to: string,
    subject: string,
    text: string,
    html: string,
  ): Promise<void> {
    const mailOptions = {
      to,
      subject,
      text,
      html,
    };

    await this.mailerService.sendMail(mailOptions);
    console.log('Message sent: %s', mailOptions);
  }

  async sendMailWithTemplate(
    to: string,
    subject: string,
    template: string,

    context: Record<string, any>,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: to,
      subject: subject,
      template: template,
      context: context,
    });
    console.log(`Send Email ${subject} to ${to}`);
  }
}

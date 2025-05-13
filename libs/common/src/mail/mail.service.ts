import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class MailService {
  constructor(@InjectQueue('mail-queue') private readonly mailQueue: Queue) {}

  async sendMail(to: string, subject: string, text: string, html: string): Promise<void> {
    await this.mailQueue.add('sendMail', { to, subject, text, html });
  }

  async sendMailWithTemplate(to: string, subject: string, template: string, context: Record<string, any>): Promise<void> {
    await this.mailQueue.add('sendMail', { to, subject, template, context });
  }
}

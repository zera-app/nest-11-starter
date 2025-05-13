import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { MailerService } from '@nestjs-modules/mailer';

interface MailJobData {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  template?: string;
  context?: Record<string, any>;
}

@Processor('mail-queue')
@Injectable()
export class MailProcessor extends WorkerHost {
  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async process(job: Job<MailJobData>) {
    const { to, subject, text, html, template, context } = job.data;
    if (template) {
      await this.mailerService.sendMail({ to, subject, template, context });
    } else {
      await this.mailerService.sendMail({ to, subject, text, html });
    }

    console.log(`Mail job completed, success send email to ${to} for ${subject}`);
  }
}

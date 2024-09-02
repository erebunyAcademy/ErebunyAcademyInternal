import fs from 'fs';
import * as nodemailer from 'nodemailer';
import path from 'path';
import { TemplateEnum } from './enums/template.enum';
import { SendMailTemplatePayloadInterface } from './interfaces/send-mail-template-payload.interface';

class EmailService {
  private _transporter: nodemailer.Transporter;

  private MAIL_FROM: string = `Erebuni Medical Academy Foundation <${process.env.SMTP_USER!}>`;
  private ADMIN_EMAIL: string = process.env.SMTP_USER!;

  constructor() {
    this._transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  private _loadTemplate(templateName: string): string {
    const templatesDir = path.join(process.cwd(), 'src/lib/prisma/services/email/templates');
    const filePath = path.join(templatesDir, `${templateName}.html`);
    return fs.readFileSync(filePath, 'utf-8');
  }

  private async _sendTemplate({
    to,
    subject,
    template,
    context = {},
  }: SendMailTemplatePayloadInterface & {
    template: string;
    context?: Record<string, any>;
  }): Promise<void> {
    const html = this._renderTemplate(template, context);

    const mailOptions: nodemailer.SendMailOptions = {
      from: this.MAIL_FROM,
      to: to,
      subject,
      html,
    };

    await this._transporter.sendMail(mailOptions).then(() => {
      console.log(`Email sent to ${to}`);
    });
  }

  private _renderTemplate(template: string, context: Record<string, any>): string {
    let html = this._loadTemplate(template);

    Object.keys(context).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, context[key]);
    });

    return html;
  }

  async sendVerificationEmail(email: string, confirmationCode: number, firstName: string) {
    return this._sendTemplate({
      to: email,
      subject: 'Verify your email',
      template: TemplateEnum.VERIFY_USER,
      context: {
        firstName,
        link: `${process.env.NEXTAUTH_URL}/am/signin?code=${confirmationCode}`,
      },
    });
  }

  async sendForgotPasswordEmail(
    email: string,
    confirmationCode: number,
    firstName: string,
  ): Promise<any> {
    return this._sendTemplate({
      to: email,
      subject: 'Verify your email',
      template: TemplateEnum.FORGOT_PASSWORD,
      context: {
        firstName,
        confirmationCode,
      },
    });
  }

  async approveUserAccountEmail(email: string, firstName: string): Promise<any> {
    return this._sendTemplate({
      to: email,
      subject: 'Your request was approved',
      template: TemplateEnum.CONFIRM_USER,
      context: {
        firstName,
        link: `${process.env.NEXT_PUBLIC_BASE_URL}/am/signin`,
      },
    });
  }

  async rejectUserAccountEmail(email: string, firstName: string, message: string): Promise<any> {
    return this._sendTemplate({
      to: email,
      subject: 'Your request was rejected',
      template: TemplateEnum.REJECT_USER,
      context: {
        firstName,
        message,
      },
    });
  }
}

export const mailService = new EmailService();

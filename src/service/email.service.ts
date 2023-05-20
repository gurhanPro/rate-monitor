import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;
  private readonly logger: Logger = new Logger(EmailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmail(recipient: string, subject: string, message: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipient,
      subject,
      text: message,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email successfully sent to ${recipient}: ${result}`);
    } catch (error) {
      this.logger.error(`Error sending email to ${recipient}: ${error}`);
    }
  }
}

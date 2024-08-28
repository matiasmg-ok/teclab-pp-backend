import { createTransport, Transporter } from 'nodemailer';

class EmailService {
  private transporter: Transporter;

  constructor(transporter: Transporter) {
    this.transporter = transporter;
  }

  async sendEmail({ to, subject, text }: { to: string | undefined, subject: string, text: string }) {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: to || process.env.EMAIL_NOTIFICATIONS,
        subject,
        text
      });
    } catch (error) {
      console.error(error);
    }
  }
}

export default new EmailService(createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  secure: true
}));
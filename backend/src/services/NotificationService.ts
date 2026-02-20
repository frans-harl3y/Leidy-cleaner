import { query } from '../utils/database';
import nodemailer from 'nodemailer';

export class NotificationService {
  private static getTransporter() {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  static async sendEmail(to: string, subject: string, text: string) {
    try {
      const transporter = this.getTransporter();
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@vammos.com',
        to,
        subject,
        text,
      });
      console.log(`[Notification] Email sent to ${to}: ${subject}`);
    } catch (error) {
      console.error('[Notification] Failed to send email:', error);
      // Fallback to console log
      console.log('[Notification] (fallback) email', to, subject, text);
    }
  }

  static async sendSMS(to: string, text: string) {
    try {
      const twilio = require('twilio');
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      
      await client.messages.create({
        body: text,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: to
      });
      
      console.log(`[Notification] SMS sent to ${to}`);
    } catch (error) {
      console.error('[Notification] Failed to send SMS:', error);
      // Fallback to console log
      console.log('[Notification] (fallback) sms to', to, text);
    }
  }

  /**
   * Convenience helper called whenever a new booking is created.
   * Sends a confirmation to the customer and (optional) a notice to
   * the assigned staff member.
   */
  static async notifyBookingCreated(booking: any) {
    try {
      // user notification
      const users = await query('SELECT email, name FROM users WHERE id = $1', [booking.user_id]);
      if (users.length > 0) {
        const user = users[0];
        await this.sendEmail(
          user.email,
          'Seu agendamento foi criado',
          `Olá ${user.name}, seu agendamento (#${booking.id}) foi criado para ${booking.scheduled_date}.`
        );
      }

      // staff notification if assigned
      if (booking.staff_id) {
        const staffRows = await query('SELECT email, name FROM users WHERE id = $1', [booking.staff_id]);
        if (staffRows.length > 0) {
          const staff = staffRows[0];
          await this.sendEmail(
            staff.email,
            'Novo agendamento atribuído',
            `Olá ${staff.name}, você foi atribuído ao agendamento #${booking.id}.`
          );
        }
      }
    } catch (err) {
      console.error('[Notification] error in notifyBookingCreated', err);
    }
  }
}

export default NotificationService;

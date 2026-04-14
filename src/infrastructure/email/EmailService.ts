import sgMail from '@sendgrid/mail';
import logger from '../logging/logger';

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}

export class EmailService {
  private isInitialized = false;

  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (apiKey) {
      sgMail.setApiKey(apiKey);
      this.isInitialized = true;
    } else {
      logger.warn('SendGrid API key not found. Email notifications will be disabled.');
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.isInitialized) {
      logger.warn('Email service not initialized. Skipping email send.');
      return false;
    }

    try {
      const msg: any = {
        to: options.to,
        from: options.from || process.env.FROM_EMAIL || 'noreply@warehouse.com',
        subject: options.subject,
      };

      if (options.html) {
        msg.html = options.html;
      } else if (options.text) {
        msg.text = options.text;
      }

      await sgMail.send(msg);
      logger.info('Email sent successfully', { to: options.to, subject: options.subject });
      return true;
    } catch (error) {
      logger.error('Failed to send email', { error, to: options.to });
      return false;
    }
  }

  async sendTransferNotification(
    to: string,
    transferId: string,
    productName: string,
    quantity: number,
    fromWarehouse: string,
    toWarehouse: string,
    status: string
  ): Promise<boolean> {
    const subject = `Inventory Transfer ${status}: ${transferId}`;
    const html = `
      <h2>Inventory Transfer Update</h2>
      <p><strong>Transfer ID:</strong> ${transferId}</p>
      <p><strong>Product:</strong> ${productName}</p>
      <p><strong>Quantity:</strong> ${quantity}</p>
      <p><strong>From:</strong> ${fromWarehouse}</p>
      <p><strong>To:</strong> ${toWarehouse}</p>
      <p><strong>Status:</strong> ${status}</p>
      <p>This is an automated notification from your Warehouse Management System.</p>
    `;

    return this.sendEmail({ to, subject, html });
  }

  async sendLowStockAlert(
    to: string,
    productName: string,
    sku: string,
    currentQuantity: number,
    warehouse: string
  ): Promise<boolean> {
    const subject = `Low Stock Alert: ${productName}`;
    const html = `
      <h2>Low Stock Alert</h2>
      <p><strong>Product:</strong> ${productName}</p>
      <p><strong>SKU:</strong> ${sku}</p>
      <p><strong>Current Quantity:</strong> ${currentQuantity}</p>
      <p><strong>Warehouse:</strong> ${warehouse}</p>
      <p>Please restock this item soon.</p>
    `;

    return this.sendEmail({ to, subject, html });
  }

  async sendWelcomeEmail(to: string, name: string): Promise<boolean> {
    const subject = 'Welcome to Warehouse Management System';
    const html = `
      <h2>Welcome ${name}!</h2>
      <p>Your account has been created successfully.</p>
      <p>You can now access the Warehouse Management System.</p>
    `;

    return this.sendEmail({ to, subject, html });
  }

  get isReady(): boolean {
    return this.isInitialized;
  }
}
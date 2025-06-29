import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    try {
      // Try to use Gmail first
      if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
        this.transporter = nodemailer.createTransporter({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
          }
        });
        console.log('✅ Email service configured with Gmail');
      }
      // Try to use Outlook/Hotmail
      else if (process.env.OUTLOOK_USER && process.env.OUTLOOK_PASSWORD) {
        this.transporter = nodemailer.createTransporter({
          service: 'outlook',
          auth: {
            user: process.env.OUTLOOK_USER,
            pass: process.env.OUTLOOK_PASSWORD
          }
        });
        console.log('✅ Email service configured with Outlook');
      }
      // Try to use custom SMTP
      else if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        this.transporter = nodemailer.createTransporter({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });
        console.log('✅ Email service configured with custom SMTP');
      }
      else {
        console.warn('⚠️ No email credentials found. Using mock email service for demo.');
        this.transporter = null;
      }
    } catch (error) {
      console.warn('⚠️ Email service initialization failed:', error.message);
      this.transporter = null;
    }
  }

  async sendEmail(to, subject, htmlContent, textContent) {
    try {
      if (!this.transporter) {
        // Mock email service for demo
        console.log(`📧 [MOCK] Email would be sent to: ${to}`);
        console.log(`📧 [MOCK] Subject: ${subject}`);
        console.log(`📧 [MOCK] Content: ${textContent}`);
        
        // Simulate email delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
          messageId: `mock-${Date.now()}`,
          response: 'Mock email sent successfully'
        };
      }

      const mailOptions = {
        from: process.env.EMAIL_USER || process.env.OUTLOOK_USER || process.env.SMTP_USER || 'noreply@lms.com',
        to: to,
        subject: subject,
        html: htmlContent,
        text: textContent
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`📧 Email sent successfully to ${to}`);
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email. Please try again.');
    }
  }

  async sendOTPEmail(to, otp, purpose = 'verification') {
    const subject = `Your OTP Code - LMS Platform`;
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #333; text-align: center; margin-bottom: 30px;">🔐 Your OTP Code</h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
          <h1 style="color: #007bff; font-size: 32px; letter-spacing: 8px; margin: 0;">${otp}</h1>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
          <strong>Purpose:</strong> ${purpose}
        </p>
        
        <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
          <strong>This OTP is valid for 10 minutes.</strong>
        </p>
        
        <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
          If you didn't request this OTP, please ignore this email.
        </p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        
        <p style="color: #999; font-size: 12px; text-align: center;">
          This is an automated message from your LMS Platform.
        </p>
      </div>
    `;
    
    const textContent = `Your OTP Code: ${otp}\n\nPurpose: ${purpose}\n\nThis OTP is valid for 10 minutes.\n\nIf you didn't request this OTP, please ignore this email.`;

    return await this.sendEmail(to, subject, htmlContent, textContent);
  }
}

export default new EmailService(); 
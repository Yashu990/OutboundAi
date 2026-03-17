import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  port: process.env.EMAIL_PORT || 587,
  auth: {
    user: process.env.EMAIL_USER || 'mock_user',
    pass: process.env.EMAIL_PASS || 'mock_pass',
  },
});

const emailService = {
  sendEmail: async (to, subject, text) => {
    try {
      console.log(`Sending email to: ${to}`);
      
      const info = await transporter.sendMail({
        from: `"OutboundAI CRM" <${process.env.EMAIL_USER || 'noreply@outboundai.com'}>`,
        to,
        subject,
        text,
      });

      console.log(`Email sent: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email Error:', error.message);
      return { success: false, error: error.message };
    }
  }
};

export default emailService;

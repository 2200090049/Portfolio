import pkg from 'nodemailer';
const nodemailer = pkg;
import SiteSettings from '../models/SiteSettings.js';

// Get email configuration from database
const getEmailConfig = async () => {
  try {
    const settings = await SiteSettings.findById('site_settings');
    if (settings && settings.emailConfig && settings.emailConfig.enabled) {
      return settings.emailConfig;
    }
    return null;
  } catch (error) {
    console.error('Error fetching email config:', error.message);
    return null;
  }
};

// Create transporter with database configuration
const createTransporter = async () => {
  const config = await getEmailConfig();
  
  // Check if email credentials are configured in database
  if (config && config.smtpHost && config.smtpUser && config.smtpPassword) {
    console.log('✅ Using email service from database settings:', config.smtpUser);
    return nodemailer.createTransporter({
      host: config.smtpHost,
      port: parseInt(config.smtpPort) || 587,
      secure: parseInt(config.smtpPort) === 465, // true for 465, false for other ports
      auth: {
        user: config.smtpUser,
        pass: config.smtpPassword,
      },
    });
  }
  
  // Fallback to environment variables if database config not set
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    console.log('✅ Using REAL email service from ENV:', process.env.EMAIL_USER);
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  
  // Development/testing - use console logging when credentials not set
  console.log('⚠️  Email credentials not set - using console logging');
  return {
    sendMail: async (mailOptions) => {
      console.log('\n📧 ========== EMAIL SIMULATION ==========');
      console.log('From:', mailOptions.from);
      console.log('To:', mailOptions.to);
      console.log('Subject:', mailOptions.subject);
      console.log('Message:');
      console.log(mailOptions.html || mailOptions.text);
      console.log('=========================================\n');
      return { messageId: 'dev-message-id' };
    }
  };
};

// Send contact form notification to admin
const sendContactNotification = async (contactData) => {
  const transporter = await createTransporter();
  const config = await getEmailConfig();
  
  const fromEmail = (config && config.senderEmail) || process.env.EMAIL_FROM || 'noreply@portfolio.com';
  const toEmail = (config && config.receiverEmail) || process.env.ADMIN_EMAIL || '2200090049csit@gmail.com';
  
  const mailOptions = {
    from: fromEmail,
    to: toEmail,
    subject: `New Contact Form Submission from ${contactData.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #00ff41;">New Contact Form Submission</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <p><strong>Name:</strong> ${contactData.name}</p>
          <p><strong>Email:</strong> ${contactData.email}</p>
          ${contactData.phone ? `<p><strong>Phone:</strong> ${contactData.phone}</p>` : ''}
          ${contactData.subject ? `<p><strong>Subject:</strong> ${contactData.subject}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${contactData.message}</p>
        </div>
        <p style="color: #666; font-size: 12px;">Received at: ${new Date().toLocaleString()}</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Contact notification email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending contact notification:', error.message);
    return false;
  }
};

// Send thank you email to contact submitter
const sendContactConfirmation = async (contactData) => {
  const config = await getEmailConfig();
  
  // Only send auto-reply if enabled in settings
  if (!config || !config.autoReply) {
    console.log('⚠️  Auto-reply is disabled in settings');
    return false;
  }
  
  const transporter = await createTransporter();
  const fromEmail = (config && config.senderEmail) || process.env.EMAIL_FROM || 'noreply@portfolio.com';
  const autoReplyMsg = (config && config.autoReplyMessage) || 'Thank you for your message. I will get back to you as soon as possible.';
  
  const mailOptions = {
    from: fromEmail,
    to: contactData.email,
    subject: 'Thank you for contacting me!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #00ff41;">Thank You for Reaching Out!</h2>
        <p>Hi ${contactData.name},</p>
        <p>${autoReplyMsg}</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <p><strong>Your Message:</strong></p>
          <p style="white-space: pre-wrap;">${contactData.message}</p>
        </div>
        <p>Best regards,<br><strong>Kuruguntla Deepak Reddy</strong></p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">This is an automated confirmation email.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Contact confirmation email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending contact confirmation:', error.message);
    return false;
  }
};;

// Send newsletter subscription confirmation
const sendNewsletterConfirmation = async (email) => {
  const transporter = await createTransporter();
  const config = await getEmailConfig();
  
  const fromEmail = (config && config.senderEmail) || process.env.EMAIL_FROM || 'noreply@portfolio.com';
  
  const mailOptions = {
    from: fromEmail,
    to: email,
    subject: 'Welcome to My Newsletter!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #00ff41;">Welcome to the Newsletter! 🎉</h2>
        <p>Thank you for subscribing to my newsletter!</p>
        <p>You'll receive updates about:</p>
        <ul>
          <li>New projects and case studies</li>
          <li>Tech insights and tutorials</li>
          <li>Design tips and best practices</li>
          <li>Industry trends and analysis</li>
        </ul>
        <p>Stay tuned for exciting content!</p>
        <p>Best regards,<br><strong>Kuruguntla Deepak Reddy</strong></p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">You can unsubscribe at any time by contacting us.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Newsletter confirmation email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending newsletter confirmation:', error.message);
    return false;
  }
};

export {
  sendContactNotification,
  sendContactConfirmation,
  sendNewsletterConfirmation,
};

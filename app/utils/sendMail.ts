import nodemailer from 'nodemailer';

const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST;
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;
const SITE_MAIL_RECEIVER = process.env.SITE_MAIL_RECEIVER;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: SMTP_SERVER_HOST,
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: SMTP_SERVER_USERNAME,
    pass: SMTP_SERVER_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function sendMail({
  email,
  sendTo,
  subject,
  text,
  html,
  attachments,
}: {
  email: string;
  sendTo?: string;
  subject: string;
  text: string;
  html?: string;
  attachments?: any[];
}) {
  try {
    const isVerified = await transporter.verify();
    if (!isVerified) {
      console.error('Transporter configuration is invalid.');
      return;
    }
  } catch (error) {
    console.error('Error verifying transporter:', error);
    return;
  }

  try {
    const mailOptions: nodemailer.SendMailOptions = {
      from: email,
      to: sendTo || SITE_MAIL_RECEIVER,
      subject: subject,
      text: text,
      html: html || '',
    };

    if (attachments && attachments.length > 0) {
      mailOptions.attachments = attachments;
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('Message Sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
  }
} 
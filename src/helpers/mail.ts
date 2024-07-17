import nodemailer from 'nodemailer';

import { IUser } from '../models/user';

// Create a test account and send email with generated account details
export const sendEmail = (receiver: IUser) => {
  // Create a Nodemailer transporter using Ethereal SMTP
  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_LOGIN,
      pass: process.env.SMTP_PASSWORD,
    }
  });

  // Send mail with defined transport object
  const mailOptions = {
    from: '"Project Manager Inc." <project-mgt-inc@example.com>',
    to: receiver.email,
    subject: 'Password Reset',
    html: `
    <p>Hello ${receiver.username},</p>
    <h1>${receiver.resetToken}</h1>
    <p>You requested for a password reset. The code expires in <b>90 seconds.</b></p>
    <p>If this wasn't you, please ignore this email.</p>`
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('Error sending email: ', error);
    }
    console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });
}
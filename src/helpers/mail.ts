import nodemailer from 'nodemailer';

import { IUser } from '../models/user';

// Create a test account and send email with generated account details
export const sendEmail = (receiver: IUser) => {
  nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.error('Failed to create a testing account. ' + err.message);
      return process.exit(1);
    }

    console.log('Credentials obtained, sending message...');

    // Create a Nodemailer transporter using Ethereal SMTP
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: account.user, // generated ethereal user
        pass: account.pass  // generated ethereal password
      }
    });

    // Send mail with defined transport object
    const mailOptions = {
      from: '"Project Manager Inc." <project-mgt-inc@example.com>',
      to: receiver.email,
      subject: 'Password Reset',
      html: `
      <p>Hello ${receiver.username},</p>
      <p>You requested a password reset. Click <a href="http://localhost:3000/api/auth/reset/${receiver.resetToken}">here</a> to reset your password</p>`
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log('Error sending email: ', error);
      }
      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
  });
}
import { APP_URL } from '../config';
import path from 'path';
import transporter from './mailer';
import mustache from 'mustache';
import * as fs from 'fs';

export const sendSignUpEmailVerification = async (to, link) => {
  try {
    const templateHtml = fs.readFileSync(
      path.join(__dirname, '../templates/emails/emailVerification.html'),
      'UTF-8',
    );
    await transporter.sendMail({
      to: to,
      subject: 'Verify Account',
      sender: 'COSMO',
      html: mustache.render(templateHtml, {
        productImage: APP_URL + '/cosmo.png',
        verifyLink: link,
      }),
    });
  } catch (error) {
    console.log(error);
  }
};

export const sendResetPasswordEmail = async (to, link) => {
  try {
    const templateHtml = fs.readFileSync(
      path.join(__dirname, '../templates/emails/emailResetPassword.html'),
      'UTF-8',
    );
    await transporter.sendMail({
      to: to,
      subject: 'Reset Password',
      sender: 'COSMO',
      html: mustache.render(templateHtml, {
        productImage: APP_URL + '/cosmo.png',
        resetLink: link,
      }),
    });
  } catch (error) {
    console.log(error);
  }
};

export const sendWelcomeEmail = async (to, link, name) => {
  try {
    const templateHtml = fs.readFileSync(
      path.join(__dirname, '../templates/emails/emailWelcomeToCosmo.html'),
      'UTF-8',
    );
    await transporter.sendMail({
      to: to,
      subject: 'Welcome to COSMO',
      sender: 'COSMO',
      html: mustache.render(templateHtml, {
        productImage: APP_URL + '/cosmo.png',
        loginLink: link,
        name: name,
      }),
    });
  } catch (error) {
    console.log(error);
  }
};

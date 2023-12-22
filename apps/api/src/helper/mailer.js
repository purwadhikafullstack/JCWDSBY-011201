import nodemailer from 'nodemailer';
import { MAILER_PASS, MAILER_USER } from '../config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MAILER_USER,
    pass: MAILER_PASS,
  },
});

export default transporter;

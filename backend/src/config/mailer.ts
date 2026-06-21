import nodemailer from 'nodemailer';
import { NODE_ENV, EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } from './env.js';

let transporter: nodemailer.Transporter | null = null;

export const getTransporter = async (): Promise<nodemailer.Transporter> => {
  if (transporter) return transporter;

  if (EMAIL_HOST && EMAIL_USER && EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: Number(EMAIL_PORT) || 587,
      secure: Number(EMAIL_PORT) === 465,
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    });
  } else {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    console.log('[Mailer] Using Ethereal test account:', testAccount.user);
  }

  await transporter.verify();
  console.log('[Mailer] Transporter ready');
  return transporter;
};

export const sendResetCode = async (to: string, code: string): Promise<void> => {
  const t = await getTransporter();
  const info = await t.sendMail({
    from: `"2nd Home" <${EMAIL_USER || 'noreply@2ndhome.com'}>`,
    to,
    subject: 'Password Reset Code',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
        <h2 style="color:#000;">Password Reset</h2>
        <p style="color:#555;font-size:14px;">Use the code below to reset your password. It expires in 1 hour.</p>
        <div style="background:#f8f8f8;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
          <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#000;">${code}</span>
        </div>
        <p style="color:#999;font-size:12px;">If you did not request this, please ignore this email.</p>
      </div>
    `,
  });

  if (NODE_ENV !== 'production') {
    console.log('[Mailer] Reset code sent. Preview URL:', nodemailer.getTestMessageUrl(info));
  }
};

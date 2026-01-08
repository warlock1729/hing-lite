import { Resend } from 'resend';

const API_KEY = process.env.RESEND_API_KEY

const resend = new Resend(API_KEY);

export async function sendVerificationMail(email: string, token: string) {
  const link = `http://localhost:3000/verify-email?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 40px;">
      <div style="max-width: 480px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; text-align: center;">
        <h2 style="color: #111827;">Verify your email</h2>
        <p style="color: #4b5563; font-size: 14px;">
          Thanks for signing up! Please click the button below to verify your email address.
        </p>

        <a href="${link}"
          style="
            display: inline-block;
            margin-top: 20px;
            padding: 12px 24px;
            background-color: #2563eb;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
          ">
          Verify Email
        </a>

        <p style="margin-top: 30px; font-size: 12px; color: #9ca3af;">
          If you did not create an account, you can safely ignore this email.
        </p>
      </div>
    </div>
  `;

  return resend.emails.send({
    from: 'testing@resend.dev',
    to: email,
    subject: 'Verify your email',
    html,
  });
}


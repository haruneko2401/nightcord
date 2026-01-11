const nodemailer = require('nodemailer');
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = require('../config/env');

// Email transporter
const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});

// Helper function to send email
async function sendResetEmail(email, resetToken) {
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    const mailOptions = {
        from: SMTP_USER || 'noreply@nightcord.com',
        to: email,
        subject: 'Reset Your Nightcord Password',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #5865F2;">Nightcord Password Reset</h2>
        <p>You requested to reset your password. Click the link below to reset it:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #5865F2; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Reset Password
        </a>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; word-break: break-all;">${resetLink}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This link will expire in 1 hour. If you didn't request this, please ignore this email.
        </p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

module.exports = {
    sendResetEmail,
};

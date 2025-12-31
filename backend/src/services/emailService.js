const nodemailer = require("nodemailer");
const logger = require("../config/logger");

/**
 * Email Service Configuration
 */

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    logger.error("Email service error:", error);
  } else {
    logger.info("Email service ready");
  }
});

/**
 * Email Templates
 */

const templates = {
  // Email verification template
  verifyEmail: (fullName, verificationLink) => ({
    subject: "Verify your SoulSupport email",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0369a1;">Welcome to SoulSupport, ${fullName}!</h2>
        <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
        <a href="${verificationLink}" style="display: inline-block; background-color: #0369a1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Verify Email
        </a>
        <p style="color: #666; font-size: 12px;">
          Or copy and paste this link: ${verificationLink}
        </p>
        <p style="color: #666; font-size: 12px;">
          This link will expire in 24 hours.
        </p>
      </div>
    `,
  }),

  // Password reset template
  resetPassword: (fullName, resetLink) => ({
    subject: "Reset your SoulSupport password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0369a1;">Password Reset Request</h2>
        <p>Hi ${fullName},</p>
        <p>We received a request to reset your password. Click the button below to proceed:</p>
        <a href="${resetLink}" style="display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Reset Password
        </a>
        <p style="color: #666; font-size: 12px;">
          Or copy and paste this link: ${resetLink}
        </p>
        <p style="color: #666; font-size: 12px;">
          This link will expire in 1 hour.
        </p>
        <p style="color: #666; font-size: 12px;">
          If you didn't request this, please ignore this email.
        </p>
      </div>
    `,
  }),

  // Session reminder template
  sessionReminder: (therapistName, clientName, sessionDate, sessionTime) => ({
    subject: `Session Reminder with ${therapistName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0369a1;">Session Reminder</h2>
        <p>Hi ${clientName},</p>
        <p>Your upcoming therapy session is scheduled for:</p>
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p><strong>Therapist:</strong> ${therapistName}</p>
          <p><strong>Date:</strong> ${sessionDate}</p>
          <p><strong>Time:</strong> ${sessionTime}</p>
        </div>
        <p>Please arrive 5-10 minutes early. If you need to reschedule, let us know as soon as possible.</p>
      </div>
    `,
  }),

  // Notification template
  notification: (title, message, actionLink, actionText) => ({
    subject: title,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0369a1;">${title}</h2>
        <p>${message}</p>
        ${
          actionLink
            ? `
          <a href="${actionLink}" style="display: inline-block; background-color: #0369a1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
            ${actionText}
          </a>
        `
            : ""
        }
      </div>
    `,
  }),
};

/**
 * Email Service Methods
 */

const emailService = {
  /**
   * Send verification email
   */
  sendVerificationEmail: async (email, fullName, token) => {
    try {
      const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
      const template = templates.verifyEmail(fullName, verificationLink);

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        ...template,
      };

      const result = await transporter.sendMail(mailOptions);
      logger.info(`Verification email sent to ${email}`);
      return result;
    } catch (error) {
      logger.error(`Failed to send verification email to ${email}:`, error);
      throw error;
    }
  },

  /**
   * Send password reset email
   */
  sendPasswordResetEmail: async (email, fullName, token) => {
    try {
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
      const template = templates.resetPassword(fullName, resetLink);

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        ...template,
      };

      const result = await transporter.sendMail(mailOptions);
      logger.info(`Password reset email sent to ${email}`);
      return result;
    } catch (error) {
      logger.error(`Failed to send password reset email to ${email}:`, error);
      throw error;
    }
  },

  /**
   * Send session reminder email
   */
  sendSessionReminder: async (email, therapistName, clientName, session) => {
    try {
      const sessionDate = new Date(session.date).toLocaleDateString();
      const sessionTime = new Date(session.date).toLocaleTimeString();
      const template = templates.sessionReminder(
        therapistName,
        clientName,
        sessionDate,
        sessionTime
      );

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        ...template,
      };

      const result = await transporter.sendMail(mailOptions);
      logger.info(`Session reminder sent to ${email}`);
      return result;
    } catch (error) {
      logger.error(`Failed to send session reminder to ${email}:`, error);
      throw error;
    }
  },

  /**
   * Send generic notification email
   */
  sendNotification: async (email, title, message, actionLink = null, actionText = null) => {
    try {
      const template = templates.notification(title, message, actionLink, actionText);

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        ...template,
      };

      const result = await transporter.sendMail(mailOptions);
      logger.info(`Notification email sent to ${email}`);
      return result;
    } catch (error) {
      logger.error(`Failed to send notification email to ${email}:`, error);
      throw error;
    }
  },

  /**
   * Send bulk emails
   */
  sendBulk: async (recipients, subject, html) => {
    try {
      const results = await Promise.all(
        recipients.map((email) =>
          transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject,
            html,
          })
        )
      );

      logger.info(`Bulk email sent to ${recipients.length} recipients`);
      return results;
    } catch (error) {
      logger.error(`Failed to send bulk emails:`, error);
      throw error;
    }
  },
};

module.exports = emailService;

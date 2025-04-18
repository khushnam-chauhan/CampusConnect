const { transporter, getVerificationEmailTemplate } = require('../config/emailConfig');

/**
 * Send verification email to user
 * @param {Object} user - User object containing fullName, email
 * @param {string} verificationToken - Generated verification token
 * @returns {Promise} - Nodemailer send response
 */
const sendVerificationEmail = async (user, verificationToken) => {
  try {
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const { subject, html } = getVerificationEmailTemplate(user.fullName, verificationLink);
    
    const mailOptions = {
      from: `"CampusConnect" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

module.exports = {
  sendVerificationEmail
};
import nodemailer from 'nodemailer'
import configs from '../configs/config';

// Function to send email
const sendVerificationEmail = async (email:string, subject:string, verificationToken:string) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 587,
            auth: {
                user: configs.MAILTRAP_USER, // Mailtrap user from .env
                pass: configs.MAILTRAP_PASS  // Mailtrap password from .env
            }
        });
        const verificationUrl = `${configs.CLIENT_URL}/user/verify/${verificationToken}`;

        const htmlContent = `
                    <p>Please verify your account by clicking the link below:</p>
                    <a href="${verificationUrl}" >Verify your account</a>`;

        await transporter.sendMail({
            from: configs.GMAIL, // Sender address
            to: email, // Receiver's email
            subject, // Email subject
            html: htmlContent // HTML content (not plain text)
        });

        // console.log("Verification email sent to:", email);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error('Email sending failed');
    }
};





export default sendVerificationEmail;

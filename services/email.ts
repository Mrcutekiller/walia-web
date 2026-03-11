import { Resend } from 'resend';

// NOTE: Usually it is best to store this in your `.env` file as EXPO_PUBLIC_RESEND_API_KEY
// Replace 're_xxxxxxxxx' with your real API key.
// Your provided key is: re_3gTX2AWw_EixGoB5XCvUTaC9CxNH1TVJ3
const resend = new Resend('re_3gTX2AWw_EixGoB5XCvUTaC9CxNH1TVJ3');

export const sendWelcomeEmail = async (toEmail: string, name: string) => {
    try {
        const data = await resend.emails.send({
            from: 'Walia AI <onboarding@resend.dev>',
            to: toEmail,
            subject: `Welcome to Walia, ${name}! 🎉`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h1 style="color: #6C63FF;">Welcome to Walia AI!</h1>
                    <p>Hi ${name},</p>
                    <p>We are thrilled to have you here! Walia brings you powerful AI tools, a supportive community, and engaging study sessions.</p>
                    <p>Get ready to unleash your potential!</p>
                    <br/>
                    <p>Cheers,<br/>The Walia Team</p>
                </div>
            `
        });
        console.log("Welcome email sent successfully:", data);
        return data;
    } catch (error) {
        console.error("Failed to send welcome email:", error);
    }
};

export const sendCredentialsEmail = async (toEmail: string, passwordString: string) => {
    try {
        const data = await resend.emails.send({
            from: 'Walia AI <onboarding@resend.dev>',
            to: toEmail,
            subject: 'Your Walia Login Credentials 🔐',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2>Keep this safe!</h2>
                    <p>Here are the login details for your new Walia account:</p>
                    <br/>
                    <table style="background: #f4f4f4; padding: 15px; border-radius: 8px; width: 100%; max-width: 400px;">
                        <tr>
                            <td><strong>Email:</strong></td>
                            <td>${toEmail}</td>
                        </tr>
                        <tr>
                            <td><strong>Password:</strong></td>
                            <td>${passwordString}</td>
                        </tr>
                    </table>
                    <br/>
                    <p><em>For security reasons, do not share your password with anyone.</em></p>
                </div>
            `
        });
        console.log("Credentials email sent successfully:", data);
        return data;
    } catch (error) {
        console.error("Failed to send credentials email:", error);
    }
};

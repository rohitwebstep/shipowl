import nodemailer from "nodemailer";

interface EmailAddress {
    name: string;
    email: string;
}

interface EmailAttachment {
    name: string;
    path: string;
}

interface SMTPConfig {
    host: string;
    port: number | string;
    secure: boolean;
    user: string;
    pass: string;
    from: string; // e.g., "Company <noreply@example.com>"
}

interface MailData {
    recipient: EmailAddress[];
    cc?: EmailAddress[];
    bcc?: EmailAddress[];
    subject: string;
    htmlBody: string;
    attachments?: EmailAttachment[];
}

interface EmailResult {
    success: boolean;
    messageId?: string;
    error?: string;
}

/**
 * Sends a professional HTML email with optional CC, BCC, and attachments.
 */
export async function sendEmail(
    config: SMTPConfig,
    mailData: MailData
): Promise<EmailResult> {
    const { host, port, secure, user, pass, from } = config;
    const {
        recipient = [],
        cc = [],
        bcc = [],
        subject,
        htmlBody,
        attachments = [],
    } = mailData;

    const formatAddressList = (list: EmailAddress[]) =>
        Array.isArray(list) ? list.map(({ name, email }) => `${name} <${email}>`) : [];

    const formatAttachments = (list: EmailAttachment[]) =>
        list.map(({ name, path }) => ({
            filename: name,
            path: path,
        }));

    try {
        const transporter = nodemailer.createTransport({
            host,
            port: Number(port),
            secure,
            auth: { user, pass },
        });

        const mailOptions = {
            from: `${from} <${user}>`,
            to: formatAddressList(recipient),
            cc: formatAddressList(cc),
            bcc: formatAddressList(bcc),
            subject,
            html: htmlBody,
            attachments: formatAttachments(attachments),
        };

        const info = await transporter.sendMail(mailOptions);

        console.log(`📤 Email sent to ${mailOptions.to.join(", ")} | ID: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error: any) {
        console.error("❌ Email Error:", error);
        return { success: false, error: error.message };
    }
}

import nodemailer from "nodemailer";

const email = process.env.EMAIL;
const emailPassword = process.env.EMAIL_PASSWORD

const transporter = nodemailer.createTransport({
    host: "mail.qualitylapelpins.com",
    port: 465,
    secure: true,
    auth: {
        user: email,
        pass: emailPassword,
    },
});

export const mailSender = async (options, body, formattedBody) => {

    const info = await transporter.sendMail({
        // From format: '"No Reply @ Quality Lapel Pins" <noreply@qualitylapelpins.com>'
        from: '"No Reply @ Quality Lapel Pins" <noreply@qualitylapelpins.com>',
        replyTo: options.replyTo
        to: options.to,
        subject: options.subject,
        text: body,
        html: formattedBody,
        attachments
    });

    console.log(info.messageId)
}



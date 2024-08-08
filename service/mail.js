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

export const mailSender = async () => {

    const info = await transporter.sendMail({
        from: '"No Reply" <noreply@qualitylapelpins.com>',
        to: "kyledkearney@gmail.com",
        subject: "Test",
        text: "Hello Javascript Email!",
        html: "<b>Hello Javascript Email</b>",
    });

    console.log(info.messageId)
}



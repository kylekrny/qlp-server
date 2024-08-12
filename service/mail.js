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
        replyTo: options.replyTo,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments,
    });

    console.log(info.messageId)
}



export const attachmentLogic = (img1, img2) => {
    const image1 = {
        filename: img1?.name,
        path: img1?.url,
    };

    const image2 = {
        filename: img2?.name,
        path: img2?.url, 
    }

    if (img1 && !img2) {
        return {attachments: [image1]}
    } else if (img2 && !img1) {
        return { attachments: [image2] }
    } else if (!img1 && !img2) {
        return { attachments: [] }
    } else if (img1 && img2) {
        return { attachments: [image1, image2] }
    }

    

}
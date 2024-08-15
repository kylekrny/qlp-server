import express from "express";
import { attachmentLogic, mailSender } from "./service/mail.js";
import dotenv from "dotenv";
import { readDocument, updateDocument, writeGenericDocument } from "./service/firestore.js";
import { generateAuthParams } from "./service/photo.js";

dotenv.config();
const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "*")
    next();
});
app.use(express.json())
const port = 3000;


const abandonedEmailOptions = (reqData) => {
    return {
        to: process.env.NOTIFICATION_EMAIL,
        replyTo: reqData.email,
        subject: `Abandoned Quote from QualityLapelpins.com`,
        text: `Name: ${reqData.name || "n/a"} \n Email: ${reqData.email} \n Product: ${reqData.product || "n/a"} \n Size: ${reqData.size || "n/a"} \n location: ${reqData.shippingLocation || "n/a"} \n, message: ${reqData.message || "n/a"}`,
        html: `<p>Name: ${reqData.name || "n/a"}</p><p>Email: ${reqData.email || "n/a"}</p><p>Product: ${reqData.product || "n/a"}</p><p>Size: ${reqData.size || "n/a"}</p><p>Location: </p><p>Message: ${reqData.message || "n/a"}</p>`
    }
}

const abandonedEmail = (data, id) => {
    mailSender(abandonedEmailOptions(data)).then(() => {
        updateDocument("quotes", id, { abandoned: true, notificationSent: Date.now() })
    }).catch((err) => {
        console.error(err)
    })
}

app.get('/', (req, res) => {
    res.send({ message: 'The app is running...' });
});

app.post('/quote', (req, res) => {
    const reqData = req.body;

    writeGenericDocument("quotes", reqData).then((docRef) => {
        res.status(200).send(JSON.stringify({ docId: docRef }))
    }).catch((error) => {
        //Admin notification
        res.status(500).send(JSON.stringify(error));
    })
});

app.get('/upload', (req, res) => {
    generateAuthParams().then((data) => {
        res.status(200).send(JSON.stringify(data));
    })
})

app.put('/quote/:id', (req, res) => {
    updateDocument("quotes", req.params.id, req.body).then((data) => {
        if (req.body.submitted) {
            readDocument("quotes", req.params.id).then((data) => {

                const userEmailOptions = {
                    to: process.env.NOTIFICATION_EMAIL,
                    replyTo: data.email,
                    subject: `${data.product} Quote from Qualitylapelpins.com`,
                    text: `Name: ${data.name || "n/a"} \n Email: ${data.email || "n/a"} \n Product: ${data.product || "n/a"} \n Size: ${data.size || "n/a"} \n location: ${data.shippingLocation || "n/a"} \n message: ${data.message || "n/a"}`,
                    html: `<p>Name: ${data.name || "n/a"}</p><p>Email: ${data.email || "n/a"}</p><p>Product: ${data.product || "n/a"}</p><p>Size: ${data.size || "n/a"}</p><p>Location: </p><p>Message: ${data.message || "n/a"}</p>`,
                    ...attachmentLogic(data.image1, data.image2),
                }

                const requesterEmailOptions = {
                    to: data.email,
                    replyTo: "info@qualitylapelpins.com",
                    subject: `Your ${data.product} quote has been successfully submitted`,
                    text: "Thank you for submitting a quote with Quality Lapel Pins we will reach out as soon as possible",
                    html: "<b>Thank you for submitting a quote with Quality Lapel Pins we will reach out as soon as possible</b>"
                }


                mailSender(userEmailOptions).then(() => {
                    res.status(200).send({ message: "Your quote has been successfully sent!" });
                    // mailSender(requesterEmailOptions);
                })
                    .catch(() => {
                        console.error(error);
                        res.status(500).send({ message: "Your message failed to send please contact Quality Lapel Pins" });
                    });
            })
        } else {
            res.status(200).send({ message: "Record successfully updated." });
        }
    }).catch((error) => {
        console.error(error);
        res.status(500).send(error);
    })
});

app.get('/exit/:id', (req, res) => {
    readDocument("quotes", req.params.id).then((data) => {
        res.sendStatus(200);
        if (data.email && !data.submitted) {
            abandonedEmail(data, req.params.id);
        }
    }).catch((err) => {
        console.log(err);
    })
})

app.listen(port, () => {
    console.log(`App listening on port 3000`);
});


const reqBody = {
    name: "string",
    email: "string",
    product: "string",
    size: "string",
    quantity: "string",
    shippingLocation: "string",
    message: "string",
    images: ["string", "string"],
    submitted: false,
}

const fireStoreBody = {
    name: "string",
    email: "string",
    product: "string",
    size: "string",
    quantity: "string",
    shippingLocation: "string",
    message: "string",
    images: ["string", "string"],
    submitted: false,
    abandoned: true,
    sent: "date",
    created: "date",
    lastUpdated: "date",
}
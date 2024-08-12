import express from "express";
import { mailSender } from "./service/mail.js";
import { auth, requiredScopes } from "express-oauth2-jwt-bearer";
import dotenv from "dotenv";
import { readDocument, updateDocument, writeGenericDocument } from "./service/firestore.js";
import { generateAuthParams } from "./service/photo.js";
import { verifyAuth } from "./middleware/auth.js";

dotenv.config();
const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "*")
    next();
});
app.use(express.json())
const port = process.env.PORT;


const abandonedEmailOptions = (reqData) => { return {
    to: "kyledkearney@gmail.com",
    replyTo: reqData.email,
    subject: `Abandoned quote from QualityLapelpins.com`,
    text: `Name: ${reqData.name || "n/a"} \n Email: ${reqData.email} \n Product: ${reqData.product || "n/a"} \n Size: ${reqData.size || "n/a"} \n location: ${reqData.shippingLocation || "n/a"} \n, message: ${reqData.message || "n/a"}`,
}}

const abandonedEmail = (data, id) => {
        mailSender(abandonedEmailOptions(data)).then(() => {
            updateDocument("quotes", id, {abandoned: true, notificationSent: Date.now()})
        }).catch((err) => {
            console.error(err)
        })
}

app.get('/', (req, res) => {
    res.send('The app is running...');
});

app.post('/quote', (req,res) => {
    const reqData = req.body;

    writeGenericDocument("quotes", reqData).then((docRef) => {
        if (req.body.submitted) {
            const userEmailOptions = {
                to: "kyledkearney@gmail.com",
                replyTo: reqData.email,
                subject: `${reqData.product} quote from QualityLapelpins.com`,
                text: `Name: ${reqData.name} \n Email: ${reqData.email} \n Product: ${reqData.product} \n Size: ${reqData.size} \n location: ${reqData.shippingLocation} \n, message: ${reqData.message}`,
                attachments: [
                    {
                        filename: `lapel-pins-01.jpg`,
                        path: reqData.images[0]
                    },
                ],
            }

            const requesterEmailOptions = {
                to: reqData.email,
                replyTo: "info@qualitylapelpins.com",
                subject: `Your ${reqData.product} quote has been successfully submitted`,
                text: "Thank you for submitting a quote with Quality Lapel Pins we will reach out as soon as possible",
                html: "<b>Thank you for submitting a quote with Quality Lapel Pins we will reach out as soon as possible</b>"
            }


            mailSender(userEmailOptions).then(() => {
                res.status(200).send("Your quote has been successfully sent!");
                mailSender(requesterEmailOptions);
            })
            .catch(() => {
                console.error;
                res.status(500).send("Your message failed to send please contact Quality Lapel Pins")
            }); 
        } else {
            res.status(200).send(JSON.stringify({docId: docRef}))
        }
    }).catch((error) => {
        //Admin notification
        res.status(500).send(JSON.stringify(error));
    })
    // ELSEIF submitted === false && OTHER CONDITION
    // send email to QLP
});

app.post('/test', (req,res) => {
    testFirebase().then(() => {
        res.sendStatus(200);
    }).catch((e) => {
        res.sendStatus(500);
        console.log(e);
    });
});

app.get('/upload', (req,res) => {
    generateAuthParams().then((data) => {
        res.status(200).send(JSON.stringify(data));
    })
})

app.put('/quote/:id', (req, res) => {
    console.log(req.params.id, req.body)
    updateDocument("quotes", req.params.id, req.body).then(() => {
        if (req.body.submitted) {
            const userEmailOptions = {
                to: "kyledkearney@gmail.com",
                replyTo: reqData.email,
                subject: `${reqData.product} quote from QualityLapelpins.com`,
                text: `Name: ${reqData.name} \n Email: ${reqData.email} \n Product: ${reqData.product} \n Size: ${reqData.size} \n location: ${reqData.shippingLocation} \n, message: ${reqData.message}`,
                attachments: [
                    {
                        filename: `lapel-pins-01.jpg`,
                        path: reqData.images[0]
                    },
                ],
            }

            const requesterEmailOptions = {
                to: reqData.email,
                replyTo: "info@qualitylapelpins.com",
                subject: `Your ${reqData.product} quote has been successfully submitted`,
                text: "Thank you for submitting a quote with Quality Lapel Pins we will reach out as soon as possible",
                html: "<b>Thank you for submitting a quote with Quality Lapel Pins we will reach out as soon as possible</b>"
            }


            mailSender(userEmailOptions).then(() => {
                res.status(200).send("Your quote has been successfully sent!");
                mailSender(requesterEmailOptions);
            })
                .catch(() => {
                    console.error;
                    res.status(500).send("Your message failed to send please contact Quality Lapel Pins")
                }); 
        } else {
            res.sendStatus(200);
        }
    }).catch((error) => {
        console.error(error)
        res.status(500).send(error)
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
    console.log(`Example app listening on port ${port}`);
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
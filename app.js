import express from "express";
import { mailSender } from "./service/mail.js";
import { auth, requiredScopes } from "express-oauth2-jwt-bearer";
import dotenv from "dotenv";
import { updateDocument, writeGenericDocument } from "./service/firestore.js";
import { generateAuthParams } from "./service/photo.js";

dotenv.config();
const app = express();

app.use(express.json())
const port = process.env.PORT;

const checkJwt = auth({
    audience: "qualitylapelpins.com",
    issuerBaseURL: "https://dev-kyle.auth0.com/",
    tokenSigningAlg: "RS256",
})

app.get('/', (req, res) => {
    res.send('The app is running...');
});

app.post('/quote', checkJwt, (req,res) => {
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
            res.status(200).send(JSON.stringify({docID: docRef}))
        }
    }).catch((error) => {
        //Admin notification
        res.status(500).send(JSON.stringify(error));
    })
    // ELSEIF submitted === false && OTHER CONDITION
    // send email to QLP
});

app.post('/test', checkJwt, (req,res) => {
    testFirebase().then(() => {
        res.sendStatus(200);
    }).catch((e) => {
        res.sendStatus(500);
        console.log(e);
    });
});

app.get('/auth', checkJwt, (req,res) => {
    generateAuthParams().then((data) => {
        res.status(200).send(JSON.stringify(data));
    })
})

app.put('/quote/:quoteId', (req, res) => {
    updateDocument("quotes", req.body.id, req.body).then(() => {
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
    }).catch(() => {
        res.status(500).send("Your message failed to send please contact Quality Lapel Pins")
    })
});

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
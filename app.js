import express from "express";
import { mailSender } from "./service/mail.js";
import { auth, requiredScopes } from "express-oauth2-jwt-bearer";
import dotenv from "dotenv";
import { testFirebase } from "./service/firestore.js";
import { generateAuthParams } from "./service/photo.js";

dotenv.config();
const app = express();
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
    mailSender().then(() => {
        res.status(200);
    })
        .catch(() => {
            console.error
        });
});

app.post('/test', checkJwt, (req,res) => {
    testFirebase().then(() => {
        res.sendStatus(200);
    }).catch((e) => {
        res.sendStatus(500);
        console.log(e);
    })
})

app.get('/auth', checkJwt, (req,res) => {
    generateAuthParams().then((data) => {
        res.status(200).send(JSON.stringify(data));
    })
})

app.put('/quote/:quoteId', (req, res) => {
    mailSender()
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
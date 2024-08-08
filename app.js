import express from "express";
import { mailSender } from "./service/mail.js";
import { auth, requiredScopes } from "express-oauth2-jwt-bearer";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 3000;

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
        res.sendStatus(200);
    })
        .catch(() => {
            console.error
        });
});

app.put('/quote/:quoteId', (req, res) => {
    mailSender()
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
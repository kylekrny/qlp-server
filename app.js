import express from "express";
import { mailSender } from "./service/mail.js";

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('The app is running...');
});


app.post('/quote', (req,res) => {
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
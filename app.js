import express from "express";
import { mailSender } from "./service/mail.js";

const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')

    mailSender().catch(console.error)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
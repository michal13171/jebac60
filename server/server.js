require('dotenv').config({ path: './.env' });

const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { resolve } = require('path');
const bodyParser = require('body-parser');
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

app.use(express.static('../public', process.env.STATIC_DIR));
app.use(bodyParser.json());
//to bedzie z serwera


app.get('/', function (req, res) {
    const path = resolve('../public', process.env.STATIC_DIR + '/index.html')
    res.sendFile(path);
})

app.get('/public-keys', (req, res) => {
    res.send({ key: process.env.STRIPE_PUBLIC_KEY });
});

// app.get('/products', (req, res) => {
//     console.log("zadzialalo")
//     res.json({name:});
// });

//to wysyła na serwer(klikasz cos i wysyła na serwer dane) - potrzebny fetch u klienta

app.post('/my-route', (req, res) => {
    console.log('body', req.body);
    res.send(req.body);
})

//jeszcze nie wiem

app.post('/webhook', (req, res) => {
    const event = req.body

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            console.log("checkout session id:", session.id)
            break;
        case 'payment_intent.created':
            const paymentIntent = event.data.object;
            console.log("payment intent created:", paymentIntent.id)
            break;
        default:
            console.log('unkwnown event type:' + event.type)
    }
    res.send({ message: 'succes' });
})

app.listen(4242, () => console.log('running on http://localhost:4242'))
const https = require("https");
const fs = require("fs");
const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase-admin');
const appointmentsRoutes = require('./routes/appointmentsRoutes');
const eventsRoutes = require('./routes/eventsRoutes');
const QRRoutes = require('./routes/QRRoutes');

const app = express();

// Initialize Firebase
const serviceAccount = require('./serviceAccountKey.json');
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: 'https://stellar-acre-379720-default-rtdb.firebaseio.com',
    storageBucket: 'gs://stellar-acre-379720.appspot.com'
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use('/appointments', appointmentsRoutes);
app.use('/events', eventsRoutes);
app.use('/qr', QRRoutes);

// Start server
const PORT = process.env.PORT || 3000;
https.createServer(
    {
       key: fs.readFileSync('key.pem'),
       cert: fs.readFileSync('cert.pem'), 
    },
    app
    ).listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

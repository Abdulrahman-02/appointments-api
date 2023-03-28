const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase-admin');
const appointmentsRoutes = require('./routes/appointmentsRoutes');
const eventsRoutes = require('./routes/eventsRoutes');

const app = express();

// Initialize Firebase
const serviceAccount = require('./serviceAccountKey.json');
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: 'https://pulse-4b296-default-rtdb.firebaseio.com'
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use('/appointments', appointmentsRoutes);
app.use('/events', eventsRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

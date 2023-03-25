import admin from "firebase-admin";
import { Appointment } from './Appointment';
const serviceAccount = require("./serviceAccountKey.json");
const express = require('express');
const bodyParser = require('body-parser');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://pulse-4b296-default-rtdb.firebaseio.com"
});

const db = admin.firestore();
const app = express();
const port = 3000;

app.use(bodyParser.json());

// API endpoint to create a new appointment
app.post('/appointments', async (req, res) => {
    const { type, dateTime, firstName, lastName, dob, email, mobilePhone } = req.body;

    // validate input data
    if (!type || !dateTime || !firstName || !lastName || !dob || !email || !mobilePhone) {
        return res.status(400).json({ message: 'Invalid input data' });
    }

    try {
        // store appointment in Firestore
        const appointmentRef = await db.collection('appointments').add({
            type,
            dateTime,
            firstName,
            lastName,
            dob,
            email,
            mobilePhone,
            userId: req.user.uid,
            hospitalId: req.hospital.hid
        });

        const appointment = await appointmentRef.get();

        return res.status(201).json({ id: appointment.id, ...appointment.data() });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error creating appointment' });
    }
});


// API endpoint for retrieving appointments
app.get('/appointments', async (req, res) => {
    try {
        // retrieve appointments from Firestore for the authenticated user
        const appointmentsRef = await db.collection('appointments').where('userId', '==', req.user.uid).get();
        const appointments: Appointment[] = [];
        
        appointmentsRef.forEach((doc) => {
            appointments.push({ id: doc.id, ...doc.data() } as Appointment);
        });

        return res.status(200).json(appointments);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error retrieving appointments' });
    }
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
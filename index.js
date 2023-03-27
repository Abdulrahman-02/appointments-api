const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase-admin');

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


// validate appointment
function validateAppointment(appointment) {
    if (!appointment.type || typeof appointment.type !== 'string') {
        throw new Error('Invalid appointment type');
    }
    if (!appointment.date || !(appointment.date instanceof Date)) {
        throw new Error('Invalid appointment date');
    }
    if (!appointment.donorFirstName || typeof appointment.donorFirstName !== 'string') {
        throw new Error('Invalid donor first name');
    }
    if (!appointment.donorLastName || typeof appointment.donorLastName !== 'string') {
        throw new Error('Invalid donor last name');
    }
    if (!appointment.donorDOB || !(appointment.donorDOB instanceof Date)) {
        throw new Error('Invalid donor date of birth');
    }
    if (!appointment.donorEmail || typeof appointment.donorEmail !== 'string') {
        throw new Error('Invalid donor email');
    }
    if (!appointment.donorMobile || typeof appointment.donorMobile !== 'string') {
        throw new Error('Invalid donor mobile number');
    }
    if (!appointment.hospitalId || typeof appointment.hospitalId !== 'string') {
        throw new Error('Invalid hospital ID');
    }
    if (!appointment.userId || typeof appointment.userId !== 'string') {
        throw new Error('Invalid user ID');
    }
}

// Get appointment by ID
app.get('/appointments/:id', async (req, res) => {
    try {
        const snapshot = await firebase.database().ref(`appointments/${req.params.id}`).once('value');
        if (snapshot.exists()) {
            const appointment = snapshot.val();
            res.status(200).json(appointment);
        } else {
            res.status(404).json({ message: 'Appointment not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

// Get appointments by hospital ID
app.get('/appointments/hospital/:hospitalId', async (req, res) => {
    try {
        const snapshot = await firebase.database().ref('appointments').orderByChild('hospitalId').equalTo(req.params.hospitalId).once('value');
        const appointments = snapshot.val();
        if (appointments) {
            res.status(200).json(appointments);
        } else {
            res.status(404).json({ message: 'No appointments found for the hospital.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

// Get appointments by user ID
app.get('/appointments/user/:userId', async (req, res) => {
    try {
        const snapshot = await firebase.database().ref('appointments').orderByChild('userId').equalTo(req.params.userId).once('value');
        const appointments = snapshot.val();
        if (appointments) {
            res.status(200).json(appointments);
        } else {
            res.status(404).json({ message: 'No appointments found for the user.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

// Get All appointments
app.get('/appointments', async (req, res) => {
    try {
        const snapshot = await firebase.database().ref('appointments').once('value');
        const appointments = [];
        snapshot.forEach((childSnapshot) => {
            const appointment = childSnapshot.val();
            appointment.id = childSnapshot.key;
            appointments.push(appointment);
        });
        res.status(200).json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

// Create appointment
app.post('/appointments', async (req, res) => {
    try {
        const { type, date, donorFirstName, donorLastName, donorDOB, donorEmail, donorMobile, hospitalId, userId } = req.body;

        if (!type || !date || !donorFirstName || !donorLastName || !donorDOB || !donorEmail || !donorMobile || !hospitalId || !userId) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        const appointmentRef = firebase.database().ref('appointments').push();
        const appointment = {
            id: appointmentRef.key,
            type,
            date,
            donorFirstName,
            donorLastName,
            donorDOB,
            donorEmail,
            donorMobile,
            hospitalId,
            userId
        };
        await appointmentRef.set(appointment);
        res.status(201).json({ id: appointment.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
});


// Update appointment
app.put('/appointments/:id', async (req, res) => {
    try {
        const snapshot = await firebase.database().ref(`appointments/${req.params.id}`).once('value');
        if (snapshot.exists()) {
            const appointment = snapshot.val();
            const { type, date, donorFirstName, donorLastName, donorDOB, donorEmail, donorMobile, hospitalId, userId } = req.body;
            const updatedAppointment = {
                id: appointment.id,
                type: type || appointment.type,
                date: date || appointment.date,
                donorFirstName: donorFirstName || appointment.donorFirstName,
                donorLastName: donorLastName || appointment.donorLastName,
                donorDOB: donorDOB || appointment.donorDOB,
                donorEmail: donorEmail || appointment.donorEmail,
                donorMobile: donorMobile || appointment.donorMobile,
                hospitalId: hospitalId || appointment.hospitalId,
                userId: userId || appointment.userId
            };
            await firebase.database().ref(`appointments/${req.params.id}`).set(updatedAppointment);
            res.status(200).json(updatedAppointment);
        } else {
            res.status(404).json({ message: 'Appointment not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

// Delete appointment
app.delete('/appointments/:id', async (req, res) => {
    try {
        const snapshot = await firebase.database().ref(`appointments/${req.params.id}`).once('value');
        if (snapshot.exists()) {
            await snapshot.ref.remove();
            res.status(200).json({ message: 'Appointment deleted successfully.' });
        } else {
            res.status(404).json({ message: 'Appointment not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
});




const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

const firebase = require('firebase-admin');

// Get appointment by ID
exports.getAppointmentById = async (req, res) => {
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
};

// Get appointments by hospital ID
exports.getAppointmentsByHospitalId = async (req, res) => {
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
}

// Get appointments by user ID
exports.getAppointmentsByUserId = async (req, res) => {
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
}

// Get All appointments
exports.getAllAppointments = async (req, res) => { 
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
}

// Create appointment
exports.createAppointment = async (req, res) => {
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
};

// Update appointment
exports.updateAppointment = async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const { type, date, donorFirstName, donorLastName, donorDOB, donorEmail, donorMobile, hospitalId, userId } = req.body;

        if (!type || !date || !donorFirstName || !donorLastName || !donorDOB || !donorEmail || !donorMobile || !hospitalId || !userId) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        const appointmentRef = firebase.database().ref(`appointments/${appointmentId}`);
        const snapshot = await appointmentRef.once('value');
        if (!snapshot.exists()) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }

        const appointmentData = {
            id: appointmentId,
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
        await appointmentRef.update(appointmentData);
        res.status(200).json({ message: 'Appointment updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
};

// delete appointment
exports.deleteAppointment = async (req, res) => {
    try {
        const snapshot = await firebase.database().ref(`appointments/${req.params.id}`).once('value');
        if (snapshot.exists()) {
            await firebase.database().ref(`appointments/${req.params.id}`).remove();
            res.status(200).json({ message: 'Appointment deleted.' });
        } else {
            res.status(404).json({ message: 'Appointment not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
};
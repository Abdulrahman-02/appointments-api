const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://pulse-4b296-default-rtdb.firebaseio.com"
});

const db = admin.firestore();


exports.createAppointment = async (req, res) => {
    try {
        // ... create appointment logic ...
        const { type, date, donorFirstName, donorLastName, donorDOB, donorEmail, donorMobile, hospitalId } = req.body;
        const userId = req.user.uid; // retrieve the authenticated user id from the request

        const newAppointment = await db.collection('appointments').add({
            type,
            date,
            donorFirstName,
            donorLastName,
            donorDOB,
            donorEmail,
            donorMobile,
            hospitalId,
            userId
        });

        return res.status(201).json(appointment);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error creating appointment' });
    }
};

exports.getAllAppointments = async (req, res) => {
    try {
        const appointmentsRef = await db.collection('appointments').where('userId', '==', req.user.uid).get();
        const appointments = [];

        appointmentsRef.forEach(appointment => {
            appointments.push({ id: appointment.id, ...appointment.data() });
        });

        return res.status(200).json(appointments);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error retrieving appointments' });
    }
};

exports.getAppointment = async (req, res) => {
    try {
        const appointmentRef = await db.collection('appointments').doc(req.params.id).get();
        const appointment = appointmentRef.data();

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        if (appointment.userId !== req.user.uid) {
            return res.status(403).json({ message: 'You are not authorized to view this appointment' });
        }

        return res.status(200).json({ id: appointmentRef.id, ...appointment });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error retrieving appointment' });
    }
};

exports.updateAppointment = async (req, res) => {
    try {
        const appointmentRef = await db.collection('appointments').doc(req.params.id).get();
        const appointment = appointmentRef.data();

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        if (appointment.userId !== req.user.uid) {
            return res.status(403).json({ message: 'You are not authorized to update this appointment' });
        }

        const { type, date, donorFirstName, donorLastName, donorDOB, donorEmail, donorMobile, hospitalId } = req.body;

        await db.collection('appointments').doc(req.params.id).update({
            type: type || appointment.type,
            date: date || appointment.date,
            donorFirstName: donorFirstName || appointment.donorFirstName,
            donorLastName: donorLastName || appointment.donorLastName,
            donorDOB: donorDOB || appointment.donorDOB,
            donorEmail: donorEmail || appointment.donorEmail,
            donorMobile: donorMobile || appointment.donorMobile,
            hospitalId: hospitalId || appointment.hospitalId
        });

        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error updating appointment' });
    }
};

exports.deleteAppointment = async (req, res) => {
    const appointmentId = req.params.id;

    try {
        // Check if the appointment exists
        const appointmentRef = await db.collection('appointments').doc(appointmentId).get();
        if (!appointmentRef.exists) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Check if the authenticated user owns the appointment
        const appointment = appointmentRef.data();
        if (appointment.userId !== req.user.uid) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Delete the appointment from Firestore
        await db.collection('appointments').doc(appointmentId).delete();

        return res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error deleting appointment' });
    }
};



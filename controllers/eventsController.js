const firebase = require('firebase-admin');

// create an event
exports.createEvent = async (req, res) => {
    try {
        const { eventTitle, eventDescription, eventLocation, hospitalId } = req.body;
        if (!eventTitle || !eventDescription || !eventLocation || !hospitalId) {
            return res.status(400).json({ message: 'Please fill in all the fields.' });
        }
        
        const eventData = {
            eventTitle,
            eventDescription,
            eventLocation,
            hospitalId
        };

        // Add the event data to the database
        const newEventRef = firebase.database().ref('events').push();
        newEventRef.set(eventData)
            .then(() => {
                res.status(201).json({
                    message: 'Event created successfully',
                    eventId: newEventRef.key
                });
            })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
};

// Get event by id
exports.getEventById = async (req, res) => {
    try {
        const snapshot = await firebase.database().ref(`events/${req.params.id}`).once('value');
        if (snapshot.exists()) {
            const event = snapshot.val();
            res.status(200).json(event);
        } else {
            res.status(404).json({ message: 'Event not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong.' });
    }

};

// Get events by hospital id
exports.getEventsByHospitalId = async (req, res) => {
    try {
        const snapshot = await firebase.database().ref('events').orderByChild('hospitalId').equalTo(req.params.hospitalId).once('value');
        const events = snapshot.val();
        if (events) {
            res.status(200).json(events);
        } else {
            res.status(404).json({ message: 'No events found for the hospital.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
};

// get all events
exports.getAllEvents = async (req, res) => {
    try {
        const snapshot = await firebase.database().ref('events').once('value');
        const events = [];
        snapshot.forEach((childSnapshot) => {
            const event = childSnapshot.val();
            event.id = childSnapshot.key;
            events.push(event);
        });
        res.status(200).json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
}

// update event
exports.updateEvent = async (req, res) => {
    try {
        const { eventTitle, eventDescription, eventLocation, hospitalId } = req.body;
        if (!eventTitle || !eventDescription || !eventLocation || !hospitalId) {
            return res.status(400).json({ message: 'Please fill in all the fields.' });
        }
        const eventData = {
            eventTitle,
            eventDescription,
            eventLocation,
            hospitalId
        };
        
        const eventRef = firebase.database().ref(`events/${req.params.id}`);
        eventRef.update(eventData)
            .then(() => {
                res.status(200).json({ message: 'Event updated successfully.' });
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
}

// delete event
exports.deleteEvent = async (req, res) => {
    try {
        const eventRef = firebase.database().ref(`events/${req.params.id}`);
        eventRef.remove()
            .then(() => {
                res.status(200).json({ message: 'Event deleted successfully.' });
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
}

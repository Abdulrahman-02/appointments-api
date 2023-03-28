const firebase = require('firebase-admin');

// create an event
exports.createEvent = async (req, res) => {
    try {
        const eventData = {
            eventTitle: req.body.eventTitle,
            eventDescription: req.body.eventDescription,
            eventLocation: req.body.eventLocation,
            hospitalId: req.body.hospitalId
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


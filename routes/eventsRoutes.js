const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');

// Create event
router.post('/', eventsController.createEvent);
// Get event by ID
router.get('/:id', eventsController.getEventById);
// Get events by hospital ID
router.get('/hospital/:hospitalId', eventsController.getEventsByHospitalId);
// Get all events
router.get('/', eventsController.getAllEvents);
// Update event
router.put('/:id', eventsController.updateEvent);
// Delete event
router.delete('/:id', eventsController.deleteEvent);
module.exports = router;
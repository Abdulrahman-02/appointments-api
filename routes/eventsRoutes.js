const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');

// Create event
router.post('/', eventsController.createEvent);

module.exports = router;
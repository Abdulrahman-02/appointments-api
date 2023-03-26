const express = require('express');
const router = express.Router();
const appointmentsController = require('../controllers/appointments.controller');

// Create a new appointment
router.post('/', appointmentsController.createAppointment);

// Get all appointments
router.get('/', appointmentsController.getAppointments);

// Get a single appointment by ID
router.get('/:id', appointmentsController.getAppointment);

// Update an appointment by ID
router.put('/:id', appointmentsController.updateAppointment);

// Delete an appointment by ID
router.delete('/:id', appointmentsController.deleteAppointment);

module.exports = router;

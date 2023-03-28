const express = require('express');
const router = express.Router();
const appointmentsController = require('../controllers/appointmentsController');

// Get appointment by ID
router.get('/:id', appointmentsController.getAppointmentById);
// Get appointments by hospital ID
router.get('/hospital/:hospitalId', appointmentsController.getAppointmentsByHospitalId);
// Get appointments by user ID
router.get('/user/:userId', appointmentsController.getAppointmentsByUserId);
// Get All appointments
router.get('/', appointmentsController.getAllAppointments);
// Create appointment
router.post('/', appointmentsController.createAppointment);
// Update appointment
router.put('/:id', appointmentsController.updateAppointment);
// Delete appointment
router.delete('/:id', appointmentsController.deleteAppointment);
module.exports = router;

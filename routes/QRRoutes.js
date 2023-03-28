const express = require('express');
const router = express.Router();
const QRController = require('../controllers/QRController');


// Generate QR code
router.get('/:id', QRController.generateQR);
// Get QR code for user
router.get('/qrcode/:id', QRController.getQRCode);

module.exports = router;

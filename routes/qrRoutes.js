// routes/qrRoutes.js
const express = require('express');
const { generateQRCode } = require('../controllers/qrController');

const router = express.Router();

router.get('/generate-qr/:sessionID', generateQRCode);

module.exports = router;
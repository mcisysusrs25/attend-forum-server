// controllers/qrController.js
const QRCode = require('qrcode');
const crypto = require('crypto');

const SECRET_KEY = 'your_secret_key_here';

// Function to encrypt session ID
function encryptSessionID(sessionID) {
    const cipher = crypto.createCipher('aes-256-cbc', SECRET_KEY);
    let encrypted = cipher.update(sessionID, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// Controller function to generate QR code
const generateQRCode = async (req, res) => {
    try {
        const sessionID = req.params.sessionID;
        const encryptedSessionID = encryptSessionID(sessionID);
        const url = `https://www.attendforum.com/session/${encryptedSessionID}`;

        // Generate QR Code
        const qrCode = await QRCode.toDataURL(url);
        res.json({ qrCode });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate QR code' });
    }
};

module.exports = { generateQRCode };

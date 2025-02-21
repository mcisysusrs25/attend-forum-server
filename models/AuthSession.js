const mongoose = require('mongoose');

const authSessionSchema = new mongoose.Schema({
    userId: {  // Changed from professorID to userId
        type: String,
        required: true,
        unique: true
    },
    token: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('AuthSession', authSessionSchema);

const mongoose = require('mongoose');

const classConfigSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const ClassConfiguration = mongoose.model('ClassConfiguration', classConfigSchema);

module.exports = ClassConfiguration;

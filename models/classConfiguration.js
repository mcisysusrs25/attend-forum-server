const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const classConfigurationSchema = new mongoose.Schema(
  {
    classConfigId: {
      type: String,
      unique: true,
      default: uuidv4, // Generates a unique ID
    },
    label: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ClassConfiguration", classConfigurationSchema);

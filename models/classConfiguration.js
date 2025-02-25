const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const classConfigurationSchema = new mongoose.Schema(
  {
    classConfigId: {
      type: String,
      unique: true,
      default: uuidv4,
    },
    userID: {
      type: String,
      required: true,
      
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

// Ensure no unique index is enforced on userID
classConfigurationSchema.index({ userID: 1 }, { unique: false });

module.exports = mongoose.model("ClassConfiguration", classConfigurationSchema);
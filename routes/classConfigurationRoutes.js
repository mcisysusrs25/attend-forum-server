const express = require("express");
const router = express.Router();
const {
  createClassConfiguration,
  getAllClassConfigurationsbyProfessorID,
  getClassConfigurationById,
  updateClassConfiguration,
  deleteClassConfiguration
} = require("../controllers/classConfigurationController");

// Create a new Class Configuration
router.post("/create", createClassConfiguration);

// Get all Class Configurations by Professor ID
router.get("/professor/:userID", getAllClassConfigurationsbyProfessorID);

// Get Class Configuration by ID
router.get("/config/:id", getClassConfigurationById);

// Update Class Configuration
router.put("/update/:classConfigId", updateClassConfiguration);

// Delete Class Configuration
router.delete("/delete/:classConfigId", deleteClassConfiguration);

module.exports = router;
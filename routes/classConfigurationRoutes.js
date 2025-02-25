const express = require("express");
const router = express.Router();
const {
    createClassConfiguration,
    getAllClassConfigurations,
    getClassConfigurationById,
    updateClassConfiguration,
    deleteClassConfiguration
} = require("../controllers/classConfigurationController");

// Create a new Class Configuration
router.post("/create", createClassConfiguration);

// Get all Class Configurations
router.get("/", getAllClassConfigurations);

// Get Class Configuration by ID
router.get("/:classConfigId", getClassConfigurationById);

// Update Class Configuration
router.put("/update/:classConfigId", updateClassConfiguration);

// Delete Class Configuration
router.delete("/delete/:classConfigId", deleteClassConfiguration);

module.exports = router;

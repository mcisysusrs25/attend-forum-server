const ClassConfiguration = require("../models/classConfiguration");

// Create a new Class Configuration
const createClassConfiguration = async (req, res, next) => {
    try {
        const { label, latitude, longitude } = req.body;

        const newClassConfig = new ClassConfiguration({ label, latitude, longitude });
        await newClassConfig.save();

        res.status(201).json({ message: "Class Configuration created successfully", data: newClassConfig });
    } catch (error) {
        next(error);
    }
};

// Get all Class Configurations
const getAllClassConfigurations = async (req, res, next) => {
    try {
        const classConfigs = await ClassConfiguration.find();
        res.status(200).json({ data: classConfigs });
    } catch (error) {
        next(error);
    }
};

// Get Class Configuration by ID
const getClassConfigurationById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const classConfig = await ClassConfiguration.findById(id);

        if (!classConfig) {
            return res.status(404).json({ message: "Class Configuration not found" });
        }

        res.status(200).json({ data: classConfig });
    } catch (error) {
        next(error);
    }
};

// Update Class Configuration
const updateClassConfiguration = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { label, latitude, longitude } = req.body;

        const updatedClassConfig = await ClassConfiguration.findByIdAndUpdate(
            id,
            { label, latitude, longitude },
            { new: true, runValidators: true }
        );

        if (!updatedClassConfig) {
            return res.status(404).json({ message: "Class Configuration not found" });
        }

        res.status(200).json({ message: "Class Configuration updated successfully", data: updatedClassConfig });
    } catch (error) {
        next(error);
    }
};

// Delete Class Configuration
const deleteClassConfiguration = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deletedClassConfig = await ClassConfiguration.findByIdAndDelete(id);
        if (!deletedClassConfig) {
            return res.status(404).json({ message: "Class Configuration not found" });
        }

        res.status(200).json({ message: "Class Configuration deleted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createClassConfiguration,
    getAllClassConfigurations,
    getClassConfigurationById,
    updateClassConfiguration,
    deleteClassConfiguration
};

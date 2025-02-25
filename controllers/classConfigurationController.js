const ClassConfiguration = require("../models/classConfiguration");

// Create a new Class Configuration
const createClassConfiguration = async (req, res, next) => {
  try {
    const { label, latitude, longitude, userID } = req.body;
    if (!label || latitude === undefined || longitude === undefined || !userID) {
      console.log(label, latitude, longitude, userID);
      return res.status(400).json({ message: "Missing required fields: label, latitude, longitude, userID" });
    }
    const newClassConfig = new ClassConfiguration({ label, latitude, longitude, userID });
    await newClassConfig.save();
    res.status(201).json({ message: "Class Configuration created successfully", data: newClassConfig });
  } catch (error) {
    next(error);
  }
};

// Get all Class Configurations by Professor ID
const getAllClassConfigurationsbyProfessorID = async (req, res, next) => {
  const { userID } = req.params;
  if (!userID) {
    return res.status(400).json({ message: "Professor ID is required" });
  }
  try {
    const classConfigs = await ClassConfiguration.find({ userID: userID });
    if (!classConfigs.length) {
      return res.status(404).json({ message: "No class configurations found" });
    }
    res.status(200).json({ data: classConfigs });
  } catch (error) {
    next(error);
  }
};

// Get Class Configuration by classConfigId
const getClassConfigurationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("got this from client->", id);
    // Query the database using classConfigId
    const classConfig = await ClassConfiguration.findOne({ classConfigId: id });
    console.log("Database query result:", classConfig);
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
    const { classConfigId } = req.params;
    const { label, latitude, longitude } = req.body;
    if (!label && latitude === undefined && longitude === undefined) {
      return res.status(400).json({ message: "At least one field (label, latitude, longitude) is required for update" });
    }
    const updatedClassConfig = await ClassConfiguration.findOneAndUpdate(
      { classConfigId },
      { $set: { label, latitude, longitude } },
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
    const { classConfigId } = req.params;
    const deletedClassConfig = await ClassConfiguration.findOneAndDelete({ classConfigId });
    if (!deletedClassConfig) {
      return res.status(404).json({ message: "Class Configuration not found" });
    }
    res.status(200).json({ message: "Class Configuration deleted successfully", data: deletedClassConfig });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createClassConfiguration,
  getAllClassConfigurationsbyProfessorID,
  getClassConfigurationById,
  updateClassConfiguration,
  deleteClassConfiguration
};
const Location = require('../models/location');

// Create a new location
const createLocation = async (req, res) => {
  try {
    const location = await Location.create(req.body);
    res.status(201).json(location);
  } catch (error) {
    console.error("Create Location Error:", error);
    res.status(500).json({ message: "Failed to create location", error });
  }
};

// Get all locations that are not deleted
const getLocations = async (req, res) => {
  try {
    const locations = await Location.find({ is_deleted: false });
    res.json(locations);
  } catch (error) {
    console.error("Get Locations Error:", error);
    res.status(500).json({ message: "Failed to get locations", error });
  }
};

// Get active locations
const getActiveLocations = async (req, res) => {
  try {
    const locations = await Location.find({ active: true, is_deleted: false });
    res.json(locations);
  } catch (error) {
    console.error("Get Active Locations Error:", error);
    res.status(500).json({ message: "Failed to get active locations", error });
  }
};

// Update a location by ID
const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Remove _id if sent in body
    if (updateData._id) delete updateData._id;

    const updatedLocation = await Location.findByIdAndUpdate(id, updateData, {
      new: true, // return the updated document
      runValidators: true // ensure validation runs on update
    });

    if (!updatedLocation) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.json(updatedLocation);
  } catch (error) {
    console.error("Update Location Error:", error);
    res.status(500).json({ message: "Failed to update location", error });
  }
};

// Soft delete a location
const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedLocation = await Location.findByIdAndUpdate(
      id,
      { is_deleted: true },
      { new: true }
    );

    if (!deletedLocation) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.json(deletedLocation);
  } catch (error) {
    console.error("Delete Location Error:", error);
    res.status(500).json({ message: "Failed to delete location", error });
  }
};

module.exports = {
  createLocation,
  getLocations,
  getActiveLocations,
  updateLocation,
  deleteLocation,
};

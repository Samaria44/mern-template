const Location = require('../models/location');

// Create a new location
const createLocation = async (data) => {
    return await Location.create(data);
};

// Get all locations that are not deleted
const getLocations = async () => {
    return await Location.find({ is_deleted: false });
};

// Get active locations (state = 'active' and not deleted)
// const getActiveLocations = async () => {
//     return await Location.find({ state: 'active', is_deleted: false });
// };

// Update location by ID
const updateLocation = async (id, data) => {
    return await Location.findByIdAndUpdate(id, data, { new: true });
};

// Soft delete location by ID (mark as deleted)
const deleteLocation = async (id, data) => {
    // You can do a soft delete by updating a field instead of removing from DB
    return await Location.findByIdAndUpdate(id, data);
};

// Get a location by ID
const getLocationById = async (id) => {
    return await Location.findById(id);
};

module.exports = {
    createLocation,
    getLocations,
    getActiveLocations,
    updateLocation,
    deleteLocation,
    getLocationById
};

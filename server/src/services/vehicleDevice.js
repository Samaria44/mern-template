const VehicleDevice = require('../models/VehicleDevice');

const createVehicleDevice = async (data) => {
    return await VehicleDevice.create(data);
};

const getVehicleDevices = async () => {
    return await VehicleDevice.find({ is_deleted: false });
};

const getFreeVehicleDevices = async () => {
    return await VehicleDevice.find({ isAssign: false, state: "active", is_deleted: false });
};

const updateVehicleDevice = async (id, data) => {
    return await VehicleDevice.findByIdAndUpdate(id, data, { new: true });
};

const deleteVehicleDevice = async (id, data) => {
    return await VehicleDevice.findByIdAndUpdate(id, data);
    // return await VehicleDevice.findByIdAndDelete(id);
};

const getVehicleDeviceById = async (id) => {
    return await VehicleDevice.findById(id);
};

module.exports = {
    createVehicleDevice,
    getVehicleDevices,
    getFreeVehicleDevices,
    updateVehicleDevice,
    deleteVehicleDevice,
    getVehicleDeviceById
};
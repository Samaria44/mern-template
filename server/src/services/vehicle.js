const Vehicle = require('../models/Vehicle');
const VehicleDevice = require('../models/VehicleDevice');

const createVehicle = async (data) => {
    let vehicle = await Vehicle.create(data);
    // vehicle = await vehicle.populate({
    //     path: 'vehicleDevice',
    //     select: '_id name'
    // });
    // await VehicleDevice.findByIdAndUpdate(data.vehicleDevice, { isAssign: true });

    // const vehicleDeviceId = vehicle.vehicleDevice._id.toString();
    // const vehicleDeviceName = vehicle.vehicleDevice.name;
    // const vehicleObj = vehicle.toObject();
    // delete vehicleObj.vehicleDevice;
    // const createdVehicle = { ...vehicleObj};
    return vehicle;
};

const getVehicles = async () => {
    let vehicles = await Vehicle.find({ is_deleted: false })
    // .populate({
    //     path: 'vehicleDevice',
    //     select: '_id name'
    // });

    // // Transform the result
    // vehicles = vehicles.map(vehicle => {
    //     const vehicleDeviceId = vehicle.vehicleDevice?._id || '';
    //     const vehicleDeviceName = vehicle.vehicleDevice?.name || '';
    //     const vehicleObj = vehicle.toObject();
    //     delete vehicleObj.vehicleDevice;
    //     return { ...vehicleObj, vehicleDeviceId, vehicleDeviceName };
    // });

    return vehicles;
};
const getFreeVehicles = async () => {
    // return await Vehicle.find({ isAssigned: false, state: "active" });
    return await Vehicle.find({ state: "active", is_deleted: false });
};

const updateVehicle = async (id, data) => {
    // const currentVehicle = await Vehicle.findById(id);
    // const isVehicleDeviceUpdated = data.vehicleDevice && data.vehicleDevice !== currentVehicle.vehicleDevice;

    let vehicle = await Vehicle.findByIdAndUpdate(id, data, { new: true })
    // .populate({
    //     path: 'vehicleDevice',
    //     select: '_id name'
    // });

    // if (isVehicleDeviceUpdated) {
    //     await VehicleDevice.findByIdAndUpdate(data.vehicleDevice, { isAssign: true });

    //     if (currentVehicle.vehicleDevice) {
    //         await VehicleDevice.findByIdAndUpdate(currentVehicle.vehicleDevice, { isAssign: false });
    //     }
    // }

    // const vehicleDeviceId = vehicle.vehicleDevice._id;
    // const vehicleDeviceName = vehicle.vehicleDevice.name;
    // const vehicleObj = vehicle.toObject();
    // delete vehicleObj.vehicleDevice;
    // const updatedVehicle = { ...vehicleObj, vehicleDeviceId, vehicleDeviceName };

    return vehicle;
};


const deleteVehicle = async (id, data) => {
    return await Vehicle.findByIdAndUpdate(id, data);
    // return await Vehicle.findByIdAndDelete(id);
};

const getVehicleById = async (id) => {
    return await Vehicle.findById(id);
};

module.exports = {
    createVehicle,
    getVehicles,
    getFreeVehicles,
    updateVehicle,
    deleteVehicle,
    getVehicleById
};
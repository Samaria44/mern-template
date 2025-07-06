
const Device = require('../models/Device');
const DeviceLog = require('../models/DeviceLog');

const createDeviceLog = async (deviceLogData) => {
    // console.log("---------------");
    let device = await Device.findOne({ ip: deviceLogData.ip });

    if (device) {
        if (device.mac != deviceLogData.mac) {
            await Device.findOneAndUpdate({ ip: device.ip }, { mac: deviceLogData.mac}, { new: true });
        }
        return await DeviceLog.create({ ...deviceLogData, deviceId: device._id });
    } else {
        throw new Error('Device not found');
    }
};

const getDeviceLogs = async () => {
    return await DeviceLog.find().sort({ created_at: -1 });
    // return await DeviceLog.find();
};
const getDeviceMACs = async () => {
    return await DeviceLog.aggregate([
        {
            $group: {
                _id: "$mac"
            }
        },
        {
            $project: {
                _id: 0,
                mac: "$_id"
            }
        }
    ]);
};

// const updateDevice = async (id, deviceData) => {
//     return await Device.findByIdAndUpdate(id, deviceData, { new: true });
// };

// const deleteDevice = async (id) => {
//     return await Device.findByIdAndDelete(id);
// };

// const getDeviceById  = async (id) => {
//     return await Device.findById(id);
// };

module.exports = {
    createDeviceLog,
    getDeviceLogs,
    getDeviceMACs
    // updateDevice,
    // deleteDevice,
    // getDeviceById 
};
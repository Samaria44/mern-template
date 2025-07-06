
const deviceLogService = require('../services/deviceLog');
const createDeviceLog = async (req, res) => {
    try {
        const { ip, time, temperature, humidity, door, mac, ac_v, dc_v } = req.body;
        const deviceLog = await deviceLogService.createDeviceLog({ ip, time, temperature, humidity, door, mac, ac_v, dc_v });
        
        res.status(201).json({
            ...deviceLog._doc
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getDeviceLogs = async (req, res) => {
    try {
        const deviceLogs = await deviceLogService.getDeviceLogs();
        res.json(deviceLogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getDeviceMACs = async (req, res) => {
    try {
        const deviceMACs = await deviceLogService.getDeviceMACs();
        res.json(deviceMACs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// const updateDevice = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const updatedDevice = await deviceService.updateDevice(id, { ...req.body, is_updated: true, updated_at: new Date(), updated_by: ""});
//         console.log(updatedDevice);

//         res.json(updatedDevice);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// const deleteDevice = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const device = await deviceService.getDeviceById(id);

//         await deviceService.deleteDevice(id);


//         res.json({ message: 'Device deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

module.exports = {
    createDeviceLog,
    getDeviceLogs,
    getDeviceMACs,
    // updateDevice,
    // deleteDevice
};
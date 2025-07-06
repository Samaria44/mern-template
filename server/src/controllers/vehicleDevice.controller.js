
const vehicleDeviceService = require('../services/vehicleDevice');
const createVehicleDevice = async (req, res) => {
    try {
        // const { name, ip, port, isConnected, eventsRegistered, Latitude, Longitude, mac } = req.body;
        const vehicleDevice = await vehicleDeviceService.createVehicleDevice({...req.body, created_by: req.userId});

        res.status(201).json({
            ...vehicleDevice._doc
        });
    } catch (error) {
        // console.log(" message: ",error.message)
        res.status(400).json({ message: error.message });
    }
};

const getVehicleDevices = async (req, res) => {
    try {
        const vehicleDevices = await vehicleDeviceService.getVehicleDevices();
        res.json(vehicleDevices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getFreeVehicleDevices = async (req, res) => {
    try {
        const vehicleDevices = await vehicleDeviceService.getFreeVehicleDevices();
        console.log("-----",vehicleDevices);
        res.json(vehicleDevices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateVehicleDevice = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedVehicleDevice = await vehicleDeviceService.updateVehicleDevice(id, { ...req.body, is_updated: true, updated_at: new Date(), updated_by: req.userId });
        // console.log(updatedVehicleDevice);

        res.status(201).json(updatedVehicleDevice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteVehicleDevice = async (req, res) => {
    const { id } = req.params;
    try {
        // const device = await deviceService.getVehicleDeviceById(id);
        await vehicleDeviceService.deleteVehicleDevice(id,  { is_deleted: true, deleted_at: new Date(), deleted_by: req.userId });
        res.json({ message: 'VehicleDevice deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createVehicleDevice,
    getFreeVehicleDevices,
    getVehicleDevices,
    updateVehicleDevice,
    deleteVehicleDevice
};
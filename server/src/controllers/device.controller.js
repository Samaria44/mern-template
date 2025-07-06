
const { getUserIdFromJwt, getUserRoleFromJwt } = require('../middleware/authMiddleware');
const deviceService = require('../services/device');
const createDevice = async (req, res) => {
    try {
        // console.log("req.userId", req.userId);
        const device = await deviceService.createDevice({ ...req.body, created_by: req.userId });

        res.status(201).json(device);
    } catch (error) {
        // console.log(" message: ",error.message)
        res.status(400).json({ message: error.message });
    }
};

const getDevices = async (req, res) => {
    // console.log("req.userId", req.userId);
    let token = req.headers["authorization"];
    // let id = getUserIdFromJwt(token);
    let role = getUserRoleFromJwt(token);
    try {
        const devices = await deviceService.getDevices(req.userId, role);
        res.json(devices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getDevicesWithEquipmentsSubEquipmentsAndEquipmentProblems = async (req, res) => {
    try {
        const devices = await deviceService.getDevicesWithEquipmentsSubEquipmentsAndEquipmentProblems();
        res.json(devices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDevicesWithEquipments = async (req, res) => {
    try {
        const devices = await deviceService.getDevicesWithEquipments();
        res.json(devices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getActiveDevices = async (req, res) => {
    try {
        const devices = await deviceService.getActiveDevices();
        res.json(devices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getActiveDevicesOfProject = async (req, res) => {
    const { projectId } = req.params;
    try {
        const devices = await deviceService.getActiveDevicesOfProject(projectId);
        res.json(devices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDeviceIPs = async (req, res) => {
    try {
        const ips = await deviceService.getDeviceIPs();
        res.json(ips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDevicesWithLatestLog = async (req, res) => {
    try {
        const devicesWithLatestLog = await deviceService.getDeviceWithLatestLog();
        res.json(devicesWithLatestLog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateDevice = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedDevice = await deviceService.updateDevice(id, { ...req.body, is_updated: true, updated_at: new Date(), updated_by: req.userId });
        // console.log(updatedDevice);

        res.status(201).json(updatedDevice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteDevice = async (req, res) => {
    const { id } = req.params;
    try {
        await deviceService.deleteDevice(id, { is_deleted: true, deleted_at: new Date(), deleted_by: req.userId });
        res.json({ message: 'Device deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createDevice,
    getDevices,
    getDevicesWithEquipmentsSubEquipmentsAndEquipmentProblems,
    getDevicesWithEquipments,
    getActiveDevices,
    updateDevice,
    deleteDevice,
    getDevicesWithLatestLog,
    getDeviceIPs,
    getActiveDevicesOfProject,
};
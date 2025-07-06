const { getUserRoleFromJwt } = require('../middleware/authMiddleware');
const equipmentService = require('../services/equipment');
const createEquipment = async (req, res) => {
    try {
        const equipment = await equipmentService.createEquipment({ ...req.body, created_by: req.userId });

        res.status(201).json(equipment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getEquipments = async (req, res) => {
    try {
        let token = req.headers["authorization"];
        // let id = getUserIdFromJwt(token);
        let role = getUserRoleFromJwt(token);
        const equipments = await equipmentService.getEquipments(req.userId, role);
        res.json(equipments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getEquipmentsOfDevice = async (req, res) => {
    const { id } = req.params;
    try {
        const equipments = await equipmentService.getEquipmentsOfDevice(id);
        res.json(equipments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getActiveEquipments = async (req, res) => {
    // console.log("---")
    try {
        const equipments = await equipmentService.getActiveEquipments();
        res.json(equipments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getActiveEquipmentsOfDevice = async (req, res) => {
    const { deviceId } = req.params;
    try {
        const equipments = await equipmentService.getActiveEquipments(deviceId);
        res.json(equipments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateEquipment = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedEquipment = await equipmentService.updateEquipment(id, { ...req.body, is_updated: true, updated_at: new Date(), updated_by: req.userId });

        res.status(201).json(updatedEquipment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteEquipment = async (req, res) => {
    const { id } = req.params;
    try {
        await equipmentService.deleteEquipment(id, { is_deleted: true, deleted_at: new Date(), deleted_by: req.userId });
        res.json({ message: 'Equipment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createEquipment,
    getEquipments,
    getEquipmentsOfDevice,
    getActiveEquipments,
    updateEquipment,
    deleteEquipment,
    getActiveEquipmentsOfDevice
};
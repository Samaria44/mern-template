
const equipmentTypeService = require('../services/equipmentType');
const { getUserIdFromJwt, getUserRoleFromJwt } = require('../middleware/authMiddleware');

const getEquipmentTypes = async (req, res) => {
    try {
        const equipmentTypes = await equipmentTypeService.getEquipmentTypes();
        res.json(equipmentTypes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getActiveEquipmentTypes = async (req, res) => {
    try {
        let token = req.headers["authorization"];
        let id = getUserIdFromJwt(token);
        let role = getUserRoleFromJwt(token);

        // console.log("equipmentType hits", id, role)

        const equipmentTypes = await equipmentTypeService.getActiveEquipmentTypes(id, role);

        res.json(equipmentTypes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createEquipmentType = async (req, res) => {
    try {
        const equipmentType = await equipmentTypeService.createEquipmentType({ ...req.body, created_by: req.userId });
        // console.log("........")
        res.status(201).json(equipmentType);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateEquipmentType = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedEquipmentType = await equipmentTypeService.updateEquipmentType(id, { ...req.body, is_updated: true, updated_at: new Date(), updated_by: req.userId });

        res.status(201).json(updatedEquipmentType);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteEquipmentType = async (req, res) => {
    const { id } = req.params;
    try {
        await equipmentTypeService.deleteEquipmentType(id, { is_deleted: true, deleted_at: new Date(), deleted_by: req.userId });

        res.json({ message: 'EquipmentType deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createEquipmentType,
    getEquipmentTypes,
    getActiveEquipmentTypes,
    updateEquipmentType,
    deleteEquipmentType
};
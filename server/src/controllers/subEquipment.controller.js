const subEquipmentService = require('../services/subEquipment');
const createSubEquipment = async (req, res) => {
    try {
        const subEquipment = await subEquipmentService.createSubEquipment({ ...req.body, created_by: req.userId });

        res.status(201).json(subEquipment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getSubEquipments = async (req, res) => {
    try {
        const subEquipments = await subEquipmentService.getSubEquipments();
        res.json(subEquipments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getSubEquipmentsOfEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        const subEquipments = await subEquipmentService.getSubEquipmentsOfEquipment(id);
        res.json(subEquipments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getSubEquipmentsOfProject = async (req, res) => {
    try {
        const { id } = req.params;
        const subEquipments = await subEquipmentService.getSubEquipmentsOfProject(id);
        res.json(subEquipments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSubEquipment = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedSubEquipment = await subEquipmentService.updateSubEquipment(id, { ...req.body, is_updated: true, updated_at: new Date(), updated_by: req.userId });

        res.status(201).json(updatedSubEquipment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteSubEquipment = async (req, res) => {
    const { id } = req.params;
    try {
        await subEquipmentService.deleteSubEquipment(id,  { is_deleted: true, deleted_at: new Date(), deleted_by: req.userId });
        res.json({ message: 'SubEquipment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createSubEquipment,
    getSubEquipments,
    getSubEquipmentsOfEquipment,
    getSubEquipmentsOfProject,
    updateSubEquipment,
    deleteSubEquipment
};
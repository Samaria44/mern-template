const equipmentProblemService = require('../services/equipmentProblem');
const createEquipmentProblem = async (req, res) => {
    try {
        const equipmentProblem = await equipmentProblemService.createEquipmentProblem({ ...req.body, created_by: req.userId });
        res.status(201).json(equipmentProblem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getEquipmentProblems = async (req, res) => {
    try {
        const equipmentProblems = await equipmentProblemService.getEquipmentProblems();
        res.json(equipmentProblems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getEquipmentProblemsOfEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        const equipmentProblems = await equipmentProblemService.getEquipmentProblemsOfEquipment(id);
        res.json(equipmentProblems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getEquipmentProblemsOfProject = async (req, res) => {
    try {
        const { id } = req.params;
        const equipmentProblems = await equipmentProblemService.getEquipmentProblemsOfProject(id);
        res.json(equipmentProblems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateEquipmentProblem = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedEquipmentProblem = await equipmentProblemService.updateEquipmentProblem(id, { ...req.body, is_updated: true, updated_at: new Date(), updated_by: req.userId });

        res.status(201).json(updatedEquipmentProblem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteEquipmentProblem = async (req, res) => {
    const { id } = req.params;
    try {
        await equipmentProblemService.deleteEquipmentProblem(id, { is_deleted: true, deleted_at: new Date(), deleted_by: req.userId });
        res.json({ message: 'EquipmentProblem deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createEquipmentProblem,
    getEquipmentProblems,
    getEquipmentProblemsOfEquipment,
    updateEquipmentProblem,
    deleteEquipmentProblem,
    getEquipmentProblemsOfProject
};
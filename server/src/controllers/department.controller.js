const departmentService = require('../services/department');
const createDepartment = async (req, res) => {
    try {
        const department = await departmentService.createDepartment({ ...req.body, created_by: req.userId });

        res.status(201).json(department);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getActiveDepartments = async (req, res) => {
    try {
        const projects = await departmentService.getActiveDepartments();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDepartments = async (req, res) => {
    try {
        const departments = await departmentService.getDepartments();
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateDepartment = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedDepartment = await departmentService.updateDepartment(id, { ...req.body, is_updated: true, updated_at: new Date(), updated_by: req.userId });

        res.status(201).json(updatedDepartment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteDepartment = async (req, res) => {
    const { id } = req.params;
    try {
        await departmentService.deleteDepartment(id, { is_deleted: true, deleted_at: new Date(), deleted_by: req.userId});
        res.json({ message: 'Department deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createDepartment,
    getDepartments,
    getActiveDepartments,
    updateDepartment,
    deleteDepartment
};
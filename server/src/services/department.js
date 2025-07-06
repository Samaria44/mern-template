const Department = require('../models/Department');

const createDepartment = async (data) => {
    return await Department.create(data);
};

const getDepartments = async () => {
    return await Department.find({ is_deleted: false });
};

const getActiveDepartments = async () => {
    return await Department.find({ state: 'active', is_deleted: false });
};

const updateDepartment = async (id, data) => {
    return await Department.findByIdAndUpdate(id, data, { new: true });
};

const deleteDepartment = async (id, data) => {
    // return await Department.findByIdAndDelete(id);
    return await Department.findByIdAndUpdate(id, data);
};

const getDepartmentById = async (id) => {
    return await Department.findById(id);
};

module.exports = {
    createDepartment,
    getDepartments,
    getActiveDepartments,
    updateDepartment,
    deleteDepartment,
    getDepartmentById
};
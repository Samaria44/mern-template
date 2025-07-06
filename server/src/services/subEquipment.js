const SubEquipment = require('../models/SubEquipment');

const createSubEquipment = async (data) => {
    const newSubEquipment = await SubEquipment.create(data);
    const populatedSubEquipment = await SubEquipment.findById(newSubEquipment._id)
        .populate('equipment')
        .populate('device')
        .exec();
    return {
        _id: populatedSubEquipment._id,
        title: populatedSubEquipment.title,
        status: populatedSubEquipment.status,
        state: populatedSubEquipment.state,
        equipment: populatedSubEquipment.equipment ? populatedSubEquipment.equipment._id : null,
        equipment_title: populatedSubEquipment.equipment ? populatedSubEquipment.equipment.title : null,
        project: populatedSubEquipment.equipment ? populatedSubEquipment.project._id : null,
        project_name: populatedSubEquipment.equipment ? populatedSubEquipment.project.name : null,
        device: populatedSubEquipment.device ? populatedSubEquipment.device._id : null,
        device_name: populatedSubEquipment.device ? populatedSubEquipment.device.name : null,
        created_at: populatedSubEquipment.created_at,
    }
};

const getSubEquipments = async () => {
    const subEquipments = await SubEquipment.find({ is_deleted: false })
        .populate('equipment')
        .populate('project')
        .populate('device')
        .exec();

    return subEquipments.map(subEquipment => ({
        _id: subEquipment._id,
        title: subEquipment.title,
        status: subEquipment.status,
        state: subEquipment.state,
        equipment: subEquipment.equipment ? subEquipment.equipment._id : null,
        equipment_title: subEquipment.equipment ? subEquipment.equipment.title : null,
        project: subEquipment.equipment ? subEquipment.project._id : null,
        project_name: subEquipment.equipment ? subEquipment.project.name : null,
        device: subEquipment.device ? subEquipment.device._id : null,
        device_name: subEquipment.device ? subEquipment.device.name : null,
        created_at: subEquipment.created_at,
    }))
};
const getSubEquipmentsOfEquipment = async (id) => {
    const subEquipments = await SubEquipment.find({ equipment: id, is_deleted: false })
        .populate('equipment')
        .populate('device')
        .exec();

    return subEquipments.map(subEquipment => ({
        _id: subEquipment._id,
        title: subEquipment.title,
        status: subEquipment.status,
        state: subEquipment.state,
        equipment: subEquipment.equipment ? subEquipment.equipment._id : null,
        equipment_title: subEquipment.equipment ? subEquipment.equipment.title : null,
        project: subEquipment.equipment ? subEquipment.project._id : null,
        project_name: subEquipment.equipment ? subEquipment.project.name : null,
        device: subEquipment.device ? subEquipment.device._id : null,
        device_name: subEquipment.device ? subEquipment.device.name : null,
        created_at: subEquipment.created_at,
    }))
};
const getSubEquipmentsOfProject = async (id) => {
    const subEquipments = await SubEquipment.find({ project: id, is_deleted: false })
        .populate('equipment')
        .populate('device')
        .exec();

    return subEquipments.map(subEquipment => ({
        _id: subEquipment._id,
        title: subEquipment.title,
        status: subEquipment.status,
        state: subEquipment.state,
        equipment: subEquipment.equipment ? subEquipment.equipment._id : null,
        equipment_title: subEquipment.equipment ? subEquipment.equipment.title : null,
        project: subEquipment.equipment ? subEquipment.project._id : null,
        project_name: subEquipment.equipment ? subEquipment.project.name : null,
        device: subEquipment.device ? subEquipment.device._id : null,
        device_name: subEquipment.device ? subEquipment.device.name : null,
        created_at: subEquipment.created_at,
    }))
};

const updateSubEquipment = async (id, data) => {
    const updatedSubEquipment = await SubEquipment.findByIdAndUpdate(id, data, { new: true })
        .populate('equipment')
        .populate('project')
        .populate('device')
        .exec();
    if (!updatedSubEquipment) {
        throw new Error('SubEquipment not found');
    }

    return {
        _id: updatedSubEquipment._id,
        title: updatedSubEquipment.title,
        status: updatedSubEquipment.status,
        state: updatedSubEquipment.state,
        equipment: updatedSubEquipment.equipment ? updatedSubEquipment.equipment._id : null,
        equipment_title: updatedSubEquipment.equipment ? updatedSubEquipment.equipment.title : null,
        project: updatedSubEquipment.project ? updatedSubEquipment.project._id : null,
        project_name: updatedSubEquipment.project ? updatedSubEquipment.project.name : null,
        device: updatedSubEquipment.device ? updatedSubEquipment.device._id : null,
        device_name: updatedSubEquipment.device ? updatedSubEquipment.device.name : null,
        created_at: updatedSubEquipment.created_at,
    }
};

const deleteSubEquipment = async (id, data) => {
    return await SubEquipment.findByIdAndUpdate(id, data);
    // return await SubEquipment.findByIdAndDelete(id);
};

const getSubEquipmentById = async (id) => {
    return await SubEquipment.findById(id);
};

module.exports = {
    createSubEquipment,
    getSubEquipments,
    getSubEquipmentsOfProject,
    getSubEquipmentsOfEquipment,
    updateSubEquipment,
    deleteSubEquipment,
    getSubEquipmentById
};
const EquipmentProblem = require('../models/EquipmentProblem');

const createEquipmentProblem = async (data) => {
    let newEquipmentProblem = await EquipmentProblem.create(data);
    let equipmentProblem = await EquipmentProblem.findById(newEquipmentProblem._id)
        .populate({ path: "project", select: '_id name' })
        .populate({ path: "device", select: '_id name' })
        .populate({ path: "equipment", select: '_id title' });

    const equipment = equipmentProblem.equipment?._id || '';
    const equipmentTitle = equipmentProblem.equipment?.title || '';
    const equipmentObj = equipmentProblem.toObject();
    delete equipmentObj.equipment;
    const device = equipmentProblem.device?._id || '';
    const deviceName = equipmentProblem.device?.name || '';
    delete equipmentObj.device;
    const project = equipmentProblem.project?._id || '';
    const projectName = equipmentProblem.project?.name || '';
    delete equipmentObj.project;
    return { ...equipmentObj, equipment, equipmentTitle, device, deviceName, project, projectName };
};

const getEquipmentProblems = async () => {
    let equipmentProblems = await EquipmentProblem.find({ is_deleted: false })
        .populate({ path: "project", select: '_id name' })
        .populate({ path: "device", select: '_id name' })
        .populate({ path: "equipment", select: '_id title' });
    equipmentProblems = equipmentProblems.map(equipmentProblem => {
        const equipment = equipmentProblem.equipment?._id || '';
        const equipmentTitle = equipmentProblem.equipment?.title || '';
        const equipmentObj = equipmentProblem.toObject();
        delete equipmentObj.equipment;
        const device = equipmentProblem.device?._id || '';
        const deviceName = equipmentProblem.device?.name || '';
        delete equipmentObj.device;
        const project = equipmentProblem.project?._id || '';
        const projectName = equipmentProblem.project?.name || '';
        delete equipmentObj.project;
        return { ...equipmentObj, equipment, equipmentTitle, device, deviceName, project, projectName };
    });
    return equipmentProblems;
};

const getEquipmentProblemsOfEquipment = async (id) => {
    let equipmentProblems = await EquipmentProblem.find({ equipment: id, is_deleted: false }).populate({ path: "equipment", select: '_id title' });
    equipmentProblems = equipmentProblems.map(equipmentProblem => {
        const equipment = equipmentProblem.equipment?._id || '';
        const equipmentTitle = equipmentProblem.equipment?.title || '';
        const equipmentObj = equipmentProblem.toObject();
        delete equipmentObj.equipment;
        return { ...equipmentObj, equipment, equipmentTitle };
    });
    return equipmentProblems;
};
const getEquipmentProblemsOfProject = async (id) => {
    let equipmentProblems = await EquipmentProblem.find({ project: id, is_deleted: false }).populate({ path: "equipment", select: '_id title' });
    equipmentProblems = equipmentProblems.map(equipmentProblem => {
        const equipment = equipmentProblem.equipment?._id || '';
        const equipmentTitle = equipmentProblem.equipment?.title || '';
        const equipmentObj = equipmentProblem.toObject();
        delete equipmentObj.equipment;
        return { ...equipmentObj, equipment, equipmentTitle };
    });
    return equipmentProblems;
};

const updateEquipmentProblem = async (id, data) => {
    const updatedEquipmentProblem = await EquipmentProblem.findByIdAndUpdate(id, data, { new: true })
        .populate({ path: "project", select: '_id name' })
        .populate({ path: "device", select: '_id name' })
        .populate({ path: "equipment", select: '_id title' });
    console.log(updatedEquipmentProblem);
    const equipment = updatedEquipmentProblem.equipment?._id || '';
    const equipmentTitle = updatedEquipmentProblem.equipment?.title || '';
    const equipmentObj = updatedEquipmentProblem.toObject();
    delete equipmentObj.equipment;
    const device = updatedEquipmentProblem.device?._id || '';
    const deviceName = updatedEquipmentProblem.device?.name || '';
    delete equipmentObj.device;
    const project = updatedEquipmentProblem.project?._id || '';
    const projectName = updatedEquipmentProblem.project?.name || '';
    delete equipmentObj.project;
    return { ...equipmentObj, equipment, equipmentTitle, device, deviceName, project, projectName };
};


const deleteEquipmentProblem = async (id, data) => {
    // return await EquipmentProblem.findByIdAndDelete(id);
    return await EquipmentProblem.findByIdAndUpdate(id, data);
};

const getEquipmentProblemById = async (id) => {
    return await EquipmentProblem.findById(id);
};

module.exports = {
    createEquipmentProblem,
    getEquipmentProblems,
    getEquipmentProblemsOfEquipment,
    updateEquipmentProblem,
    deleteEquipmentProblem,
    getEquipmentProblemById,
    getEquipmentProblemsOfProject
};
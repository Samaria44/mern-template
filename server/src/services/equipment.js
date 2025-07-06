const Equipment = require('../models/Equipment');
const Device = require('../models/Device');
const User = require('../models/User');

// const createEquipment = async (data) => {
//     console.log("data", data)
//     if (data.allLocations) {
//         const locations = await Device.find({ project: data.project, is_deleted: false })
//         console.log("locations", locations)
//         locations.map((location) => {

//         })

//     } else {
//         const newEquipment = await Equipment.create(data);
//         const newEquipmentData = await Equipment.findById(newEquipment._id).populate("device").populate("project");
//         const device = newEquipmentData.device ? newEquipmentData.device._id : null
//         const device_name = newEquipmentData.device ? newEquipmentData.device.name : null
//         const project = newEquipmentData.project ? newEquipmentData.project._id : null
//         const project_name = newEquipmentData.project ? newEquipmentData.project.name : null
//         delete newEquipmentData.device;
//         delete newEquipmentData.project;
//         return { ...newEquipmentData._doc, device, device_name, project, project_name };
//     }
// };

const createEquipment = async (data) => {
    // console.log("data", data);
    if (data.allLocations) {
        const locations = await Device.find({ project: data.project, is_deleted: false });
        console.log("locations", locations);

        const createdEquipments = await Promise.all(
            locations.map(async (location) => {
                const equipmentData = {
                    ...data,
                    location: location._id, // Assign the location for each equipment
                    device: location._id, // Assuming the location's `_id` is used as the device reference
                };
                const newEquipment = await Equipment.create(equipmentData);
                const populatedEquipment = await Equipment.findById(newEquipment._id)
                    .populate("device")
                    .populate("project");

                const device = populatedEquipment.device ? populatedEquipment.device._id : null;
                const device_name = populatedEquipment.device ? populatedEquipment.device.name : null;
                const project = populatedEquipment.project ? populatedEquipment.project._id : null;
                const project_name = populatedEquipment.project ? populatedEquipment.project.name : null;

                delete populatedEquipment.device;
                delete populatedEquipment.project;

                return {
                    ...populatedEquipment._doc,
                    device,
                    device_name,
                    project,
                    project_name
                };
            })
        );

        return createdEquipments; // Return all created equipment
    } else {
        const newEquipment = await Equipment.create(data);
        const newEquipmentData = await Equipment.findById(newEquipment._id)
            .populate("device")
            .populate("project");

        const device = newEquipmentData.device ? newEquipmentData.device._id : null;
        const device_name = newEquipmentData.device ? newEquipmentData.device.name : null;
        const project = newEquipmentData.project ? newEquipmentData.project._id : null;
        const project_name = newEquipmentData.project ? newEquipmentData.project.name : null;

        delete newEquipmentData.device;
        delete newEquipmentData.project;

        return {
            ...newEquipmentData._doc,
            device,
            device_name,
            project,
            project_name
        };
    }
};
const getEquipments = async (userId, role) => {
    // return await Equipment.find().populate("device");
    const equipments = await Equipment.find({ is_deleted: false }).populate("device").populate("project");
    const user = await User.findById(userId);
    const projects = await user.assigned_projects;
    // console.log("role",role[0].name);
    if (role[0].name == 'super admin' || role[0].name == 'admin') {
        const transformedEquipments = equipments.map(equipment => ({
            ...equipment.toObject(),
            device: equipment.device ? equipment.device._id : null,
            device_name: equipment.device ? equipment.device.name : null,
            project: equipment.project ? equipment.project._id : null,
            project_name: equipment.project ? equipment.project.name : null,
        }));

        return transformedEquipments;
    }

    const transformedEquipments = equipments
        .filter(equipment => equipment.project && projects.includes(equipment.project._id.toString()))
        .map(equipment => ({
            ...equipment.toObject(),
            device: equipment.device ? equipment.device._id : null,
            device_name: equipment.device ? equipment.device.name : null,
            project: equipment.project ? equipment.project._id : null,
            project_name: equipment.project ? equipment.project.name : null,
        }));

    return transformedEquipments;
};

const getActiveEquipments = async () => {
    return await Equipment.find({ state: 'active', is_deleted: false });
};
const getActiveEquipmentsOfDevice = async (deviceId) => {
    return await Equipment.find({ state: 'active', is_deleted: false, device: deviceId });
};

const getEquipmentsOfDevice = async (id) => {
    return await Equipment.find({ device: id, is_deleted: false });
};

const updateEquipment = async (id, data) => {
    const updatedEquipment = await Equipment.findByIdAndUpdate(id, data, { new: true }).populate("device").populate("project");
    const device = updatedEquipment.device ? updatedEquipment.device._id : null
    const device_name = updatedEquipment.device ? updatedEquipment.device.name : null
    const project = updatedEquipment.project ? updatedEquipment.project._id : null
    const project_name = updatedEquipment.project ? updatedEquipment.project.name : null
    delete updatedEquipment.device;
    delete updatedEquipment.project;
    return { ...updatedEquipment._doc, device, device_name, project, project_name };
};

const deleteEquipment = async (id, data) => {
    // return await Equipment.findByIdAndDelete(id);
    return await Equipment.findByIdAndUpdate(id, data);
};

const getEquipmentById = async (id) => {
    return await Equipment.findById(id);
};

module.exports = {
    createEquipment,
    getEquipments,
    getEquipmentsOfDevice,
    getActiveEquipments,
    updateEquipment,
    deleteEquipment,
    getEquipmentById,
    getActiveEquipmentsOfDevice
};
const EquipmentType = require('../models/EquipmentType');
const User = require('../models/User');

const createEquipmentType = async (data) => {
    const normalizedName = data.name.toLowerCase();

    const existingEquipmentType = await EquipmentType.findOne({ name: { $regex: new RegExp(`^${normalizedName}$`, 'i') }, is_deleted: false });
    if (existingEquipmentType) {
        throw new Error('EquipmentType name already exists.');
    }
    // console.log("data",data)
    return await EquipmentType.create(data);
};

const getEquipmentTypes = async () => {
    return await EquipmentType.find({ is_deleted: false });
};

const getActiveEquipmentTypes = async (id, role) => {

    if (role[0].name == 'user') {
        const user = await User.findById(id).select('assigned_equipmentTypes');
        if (!user) {
            throw new Error('User not found');
        }
        const equipmentTypes = await EquipmentType.find({
            _id: { $in: user.assigned_equipmentTypes },
            state: 'active',
            is_deleted: false,
        });

        return equipmentTypes;
    }
    const equipmentTypes = await EquipmentType.find({ state: 'active', is_deleted: false });
    return equipmentTypes
};

const updateEquipmentType = async (id, data) => {
    return await EquipmentType.findByIdAndUpdate(id, data, { new: true });
};
 
const deleteEquipmentType = async (id, data) => {
    return await EquipmentType.findByIdAndUpdate(id, data);
};

const getEquipmentTypeById = async (id) => {
    return await EquipmentType.findById(id);
};

module.exports = {
    createEquipmentType,
    getEquipmentTypes,
    getActiveEquipmentTypes,
    updateEquipmentType,
    deleteEquipmentType,
    getEquipmentTypeById
};
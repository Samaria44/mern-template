const Permission = require('../models/Permission');

const createPermission = async (data) => {
    return await Permission.create(data);
};

// const getPermissions = async () => {
//     // return await Permission.find().populate("device");
//     const permissions = await Permission.find().populate({
//         path: "device",
//         // select: "name -_id", // Select only the name field, excluding the _id
//     });

//     // Transform the populated result to only include the device name
//     const transformedPermissions = permissions.map(permission => ({
//         ...permission.toObject(),
//         device: permission.device._id,
//         device_name: permission.device.name,
//     }));

//     return transformedPermissions;
// };
// const getActivePermissions = async () => {
//     return await Permission.find()
// };

const updatePermission = async (id, data) => {
    return await Permission.findByIdAndUpdate(id, data, { new: true });
};

// const deletePermission = async (id) => {
//     return await Permission.findByIdAndDelete(id);
// };

const getPermissionById = async (id) => {
    // return await Permission.findById(id);
    const permission = await Permission.find({ userId: id });
    return permission ? permission[0] : {}
};

module.exports = {
    createPermission,
    // getPermissions,
    // getActivePermissions,
    updatePermission,
    // deletePermission,
    getPermissionById
};
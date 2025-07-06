const Version = require('../models/Version');
const User = require('../models/User');

const createVersion = async (data) => {
    const normalizedName = data.name.toLowerCase();

    const existingVersion = await Version.findOne({ name: { $regex: new RegExp(`^${normalizedName}$`, 'i') }, is_deleted: false });
    if (existingVersion) {
        throw new Error('Version name already exists.');
    }

    if (data.status === "active") {
        // Set all existing versions to "inactive" before creating a new active version
        await Version.updateMany({ is_deleted: false }, { $set: { status: "inactive" } });
    }

    return await Version.create(data);
};

const getVersions = async () => {
    return await Version.find({ is_deleted: false });
};
const getActiveVersion = async () => {
    return await Version.findOne({ is_deleted: false, status: "active" });
};

const getActiveVersions = async (id, role) => {

    if (role[0].name == 'user') {
        const user = await User.findById(id).select('assigned_versions');
        if (!user) {
            throw new Error('User not found');
        }
        const versions = await Version.find({
            _id: { $in: user.assigned_versions },
            state: 'active',
            is_deleted: false,
        });

        return versions;
    }
    const versions = await Version.find({ status: 'active', is_deleted: false });
    return versions
};

const updateVersion = async (id, data) => {
    if (data.status === "active") {
        // Set all existing versions to "inactive" before creating a new active version
        await Version.updateMany({ is_deleted: false }, { $set: { status: "inactive" } });
    }
    return await Version.findByIdAndUpdate(id, data, { new: true });
};

const deleteVersion = async (id, data) => {
    return await Version.findByIdAndUpdate(id, data);
};

const getVersionById = async (id) => {
    return await Version.findById(id);
};

module.exports = {
    createVersion,
    getVersions,
    getActiveVersion,
    getActiveVersions,
    updateVersion,
    deleteVersion,
    getVersionById
};
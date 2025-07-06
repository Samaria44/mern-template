const Project = require('../models/Project');
const User = require('../models/User');

const createProject = async (data) => {
    // Normalize the project name to lowercase for consistent comparison
    const normalizedName = data.name.toLowerCase();

    // Check if the project name already exists in a case-insensitive manner
    const existingProject = await Project.findOne({ name: { $regex: new RegExp(`^${normalizedName}$`, 'i') }, is_deleted: false });
    if (existingProject) {
        throw new Error('Project name already exists.');
    }

    // Create a new project with the normalized name
    return await Project.create(data);
};

const getProjects = async () => {
    return await Project.find({ is_deleted: false });
};

const getActiveProjects = async (id, role) => {

    // console.log("project hits", role[0].name)
    if (role[0].name == 'user') {
        const user = await User.findById(id).select('assigned_projects');
        if (!user) {
            throw new Error('User not found');
        }
        const projects = await Project.find({
            _id: { $in: user.assigned_projects },
            state: 'active',
            is_deleted: false,
        });

        return projects;
    }
    const projects = await Project.find({ state: 'active', is_deleted: false });
    return projects
};

const updateProject = async (id, data) => {
    return await Project.findByIdAndUpdate(id, data, { new: true });
};
 
const deleteProject = async (id, data) => {
    return await Project.findByIdAndUpdate(id, data);
    // return await Project.findByIdAndDelete(id);
};

const getProjectById = async (id) => {
    return await Project.findById(id);
};

module.exports = {
    createProject,
    getProjects,
    getActiveProjects,
    updateProject,
    deleteProject,
    getProjectById
};
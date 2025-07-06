
const projectService = require('../services/project');
const { getUserIdFromJwt, getUserRoleFromJwt } = require('../middleware/authMiddleware');
const createProject = async (req, res) => {
    try {
        const project = await projectService.createProject({ ...req.body, created_by: req.userId });

        res.status(201).json({
            ...project._doc
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getProjects = async (req, res) => {
    try {
        const projects = await projectService.getProjects();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getActiveProjects = async (req, res) => {
    try {
        let token = req.headers["authorization"];
        let id = getUserIdFromJwt(token);
        let role = getUserRoleFromJwt(token);

        // console.log("project hits", id, role)

        const projects = await projectService.getActiveProjects(id, role);

        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProject = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedProject = await projectService.updateProject(id, { ...req.body, is_updated: true, updated_at: new Date(), updated_by: req.userId });

        res.status(201).json(updatedProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        await projectService.deleteProject(id, { is_deleted: true, deleted_at: new Date(), deleted_by: req.userId });

        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createProject,
    getProjects,
    getActiveProjects,
    updateProject,
    deleteProject
};

const teamService = require('../services/team');
const loginLogsService = require('../services/loginLog');
const createTeam = async (req, res) => {
    try {
        const team = await teamService.createTeam({ ...req.body, created_by: req.userId });

        res.status(201).json({
            ...team._doc
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getTeams = async (req, res) => {
    try {
        const teams = await teamService.getTeams();
        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getTeamsloginlogs = async (req, res) => {
    try {
        const teams = await loginLogsService.getTeamsloginlogs(req.body);
        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTeamById = async (req, res) => {
    try {
        const teams = await teamService.getTeamById(req.userId);
        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFreeTeams = async (req, res) => {
    try {
        const teams = await teamService.getFreeTeams();
        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTeam = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedTeam = await teamService.updateTeam(id, { ...req.body, is_updated: true, updated_at: new Date(), updated_by: req.userId });
        res.status(201).json(updatedTeam);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteTeam = async (req, res) => {
    const { id } = req.params;
    try {
        await teamService.deleteTeam(id, { is_deleted: true, deleted_at: new Date(), deleted_by: req.userId });
        res.json({ message: 'Team deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createTeam,
    getFreeTeams,
    getTeams,
    updateTeam,
    deleteTeam,
    getTeamById,
    getTeamsloginlogs
};
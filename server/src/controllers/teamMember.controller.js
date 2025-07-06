
const teamMemberService = require('../services/teamMember');

const createTeamMember = async (req, res) => {
    try {
        const teamMember = await teamMemberService.createTeamMember({...req.body, created_by: req.userId});
        res.status(201).json(teamMember);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getTeamMembers = async (req, res) => {
    try {
        const teamMembers = await teamMemberService.getTeamMembers();
        res.json(teamMembers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFreeTeamMembers = async (req, res) => {
    try {
        const teamMembers = await teamMemberService.getFreeTeamMembers();
        res.json(teamMembers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTeamMember = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedTeamMember = await teamMemberService.updateTeamMember(id, { ...req.body, is_updated: true, updated_at: new Date(), updated_by: req.userId });
        res.status(201).json(updatedTeamMember);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteTeamMember = async (req, res) => {
    const { id } = req.params;
    try {
        await teamMemberService.deleteTeamMember(id,  {  is_deleted: true, deleted_at: new Date(), deleted_by: req.userId });
        res.json({ message: 'TeamMember deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createTeamMember,
    getTeamMembers,
    getFreeTeamMembers,
    updateTeamMember,
    deleteTeamMember
};
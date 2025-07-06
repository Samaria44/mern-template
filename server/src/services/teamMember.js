const TeamMember = require('../models/TeamMember');
const Team = require('../models/Team');

const createTeamMember = async (data) => {
    let teamMember = await TeamMember.create(data);
    return teamMember;
};

const getTeamMembers = async () => {
    let teamMembers = await TeamMember.find({ is_deleted: false })
    return teamMembers;
};

const getFreeTeamMembers = async () => {

    const teams = await Team.find({}, 'members').lean();

    const memberIds = teams.reduce((acc, team) => {
        return acc.concat(team.members);
    }, []);

    const freeTeamMembers = await TeamMember.find({ _id: { $nin: memberIds }, is_deleted: false });
        // .populate('roles', 'name'); // Populate roles to filter them later

    return freeTeamMembers;
    // return await TeamMember.find({ state: "active", is_deleted: false });
};

const updateTeamMember = async (id, data) => {
    let teamMember = await TeamMember.findByIdAndUpdate(id, data, { new: true })
    return teamMember;
};

const deleteTeamMember = async (id, data) => {
    return await TeamMember.findByIdAndUpdate(id, data);
};

const getTeamMemberById = async (id) => {
    return await TeamMember.findById(id);
};

module.exports = {
    createTeamMember,
    getTeamMembers,
    getFreeTeamMembers,
    updateTeamMember,
    deleteTeamMember,
    getTeamMemberById
};
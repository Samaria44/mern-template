const Team = require('../models/Team');
const Role = require('../models/Role');
const Vehicle = require('../models/Vehicle');
const bcrypt = require("bcryptjs");

const createTeam = async (data) => {
    const { members, membersList, ...rest } = data;
    if (rest.username == "") {
        throw new Error('Username is required! ');
    }

    const existingUser = await Team.findOne({
        $or: [
            { username: rest.username }
        ]       
    });

    if (existingUser) {
        throw new Error('Team with this username already exists');
    }

    // const team = await Team.create({ ...rest, username: rest.username, password: bcrypt.hashSync("P@ssw0rd", 8) });
    const team = new Team({ ...rest, username: rest.username, password: bcrypt.hashSync("P@ssw0rd", 8) });
    const savedTeam = await team.save();
    let c_role;

    const role = await Role.findOne({ name: "user" });
    savedTeam.roles = [role._id];
    c_role = [role.name];

    await savedTeam.save();
    // if(rest.vehicle!=""){
    Vehicle.findByIdAndUpdate(rest.vehicle, { isAssigned: true });
    // }
    return team;
};

const getTeams = async () => {
    return await Team.find({ is_deleted: false })
        .populate({
            path: "members",
            select: 'firstName lastName email number'
        })
    // .populate("vehicle");
};

const getFreeTeams = async () => {
    return await Team.find({ state: "active", is_deleted: false });
};

const updateTeam = async (id, data) => {
    // console.log(data);
    const team = Team.findById(id);
    if (data.membersList) {
        data.members = data.membersList.map(member => member._id);
    } else {
        data.members = [];
    }
    delete data.membersList;
    if (team.vehicle !== data.vehicle) {
        await Vehicle.findByIdAndUpdate(team.vehicle, { isAssigned: false });
        await Vehicle.findByIdAndUpdate(data.vehicle, { isAssigned: true });
    }
    return await Team.findByIdAndUpdate(id, data, { new: true });
};

const deleteTeam = async (id, data) => {
    return await Team.findByIdAndUpdate(id, data);
    // return await Team.findByIdAndDelete(id);
};

const getTeamById = async (id) => {
    // console.log("===")
    if (!id) {
        throw new Error("Team ID is required.");
    }

    // Fetch team and populate members
    const team = await Team.findById(id).populate({
        path: "members",
        select: 'firstName lastName'
    });

    // Check if team exists
    if (!team) {
        throw new Error("Team not found.");
    }
    // console.log("team",team)
    return team;
};



module.exports = {
    createTeam,
    getTeams,
    getFreeTeams,
    updateTeam,
    deleteTeam,
    getTeamById
};
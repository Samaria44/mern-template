const Role = require('../models/Role');
const User = require('../models/User');
const Permission = require('../models/Permission');
const bcrypt = require("bcryptjs");
const Team = require('../models/Team');
const { generatePermissions } = require('../utils/HelperFunctions');

const createUser = async (userData) => {
    const existingUser = await User.findOne({
        $or: [
            { email: userData.email },
            { username: userData.username }
        ]
    });

    if (existingUser) {
        throw new Error('User with this email or username already exists');
    }

    const user = new User({
        email: userData.email,
        name: userData.name,
        username: userData.username,
        number: userData.number,
        department: userData.department,
        cnic: userData.cnic,
        password: bcrypt.hashSync(userData.email + "@123", 8),
        created_by: userData.created_by
    });

    const savedUser = await user.save();
    let c_role;

    if (userData.roles && userData.roles.length > 0) {
        const roles = await Role.find({
            name: { $in: userData.roles }
        });

        savedUser.roles = roles.map(role => role._id);
        c_role = roles.map(role => role.name);
    } else {
        const role = await Role.findOne({ name: "user" });
        savedUser.roles = [role._id];
        c_role = [role.name];
    }

    await savedUser.save();

    const populatedUser = await User.findById(savedUser._id)
        .populate('department')
        .populate({
            path: 'roles',
            select: 'name'
        });

    const permission = new Permission({
        userId: populatedUser._id,
        ...generatePermissions(false)
    });

    await permission.save();
    return {
        _id: populatedUser._id,
        name: populatedUser.name,
        email: populatedUser.email,
        username: populatedUser.username,
        number: populatedUser.number,
        cnic: populatedUser.cnic,
        department_name: populatedUser.department ? populatedUser.department.name : 'N/A',
        department: populatedUser.department ? populatedUser.department._id : 'N/A',
        role: populatedUser.roles[0].name,
        created_at: populatedUser.created_at
    };
};

const getUsers = async () => {
    const users = await User.find({ is_deleted: false })
        .select('_id name username number email roles department cnic created_at')
        .populate({
            path: 'roles',
            match: { name: { $ne: 'super admin' } },
            select: 'name'
        })
        .populate({
            path: 'department',
            select: 'name'
        })
        .populate('assigned_projects');

    const transformedUsers = users
        .filter(user => user.roles.length > 0)
        .map(user => ({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            number: user.number,
            cnic: user.cnic,
            department_name: user.department ? user.department.name : 'N/A',
            department: user.department ? user.department._id : 'N/A',
            // assigned_projects: user?.assigned_projects,
            role: user.roles.map(role => role.name).join(', '),
            created_at: user.created_at
        }));

    return transformedUsers;
};

const getUserAssignedProjects = async (id) => {
    const users = await User.findById({ _id: id, is_deleted: false })
        .populate('assigned_projects');
    return users;
};

const getUser = async (id) => {
    // Find user by ID with populated fields
    const user = await User.findById(id)
        .select('_id name username number email roles department cnic created_at')
        .populate({
            path: 'roles',
            select: 'name'
        })
        .populate({
            path: 'department',
            select: 'name'
        });

    // Transform the user data
    const transformedUser = (user) => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        number: user.number,
        cnic: user.cnic,
        department_name: user.department ? user.department.name : 'N/A',
        department: user.department ? user.department._id : 'N/A',
        role: user.roles.map(role => role.name).join(', '),
        created_at: user.created_at
    });

    // Return the transformed user data
    return transformedUser(user);
};

const getFreeUsers = async () => {
    // console.log("called");
    // Get all user IDs that are members of any team
    const teams = await Team.find({}, 'members').lean();
    const memberIds = teams.reduce((acc, team) => {
        return acc.concat(team.members);
    }, []);



    // Find users whose IDs are not in the list of member IDs
    const freeUsers = await User.find({ _id: { $nin: memberIds }, is_deleted: false })
        .populate('roles', 'name'); // Populate roles to filter them later

    // Filter out users with the 'super admin' role
    const nonSuperAdminUsers = freeUsers.filter(user => {
        return !user.roles.some(role => role.name === 'super admin');
    });

    return nonSuperAdminUsers;
};

const updateUser = async (id, userData) => {
    const existingUser = await User.findOne({
        $or: [
            { email: userData.email },
            { username: userData.username }
        ]
    });

    if (existingUser && existingUser._id != id) {
        throw new Error('User with this email or username already exists');
    }
    const role = await Role.findOne({ name: userData.role });
    await User.findByIdAndUpdate(id, { ...userData, roles: [role._id] });

    const populatedUser = await User.findById(id)
        .populate('department')
        .populate({
            path: 'roles',
            select: 'name'
        });

    return {
        _id: populatedUser._id,
        name: populatedUser.name,
        email: populatedUser.email,
        username: populatedUser.username,
        number: populatedUser.number,
        cnic: populatedUser.cnic,
        department_name: populatedUser.department ? populatedUser.department.name : 'N/A',
        department: populatedUser.department ? populatedUser.department._id : 'N/A',
        role: populatedUser.roles[0].name,
        created_at: populatedUser.created_at
    };
};

const deleteUser = async (id, data) => {
    return await User.findByIdAndUpdate(id, data);
    // return await User.findByIdAndDelete(id);
};

const getUserById = async (id) => {
    return await User.findById(id);
};

const addProjectToUser = async (id, data) => {
    const user = await User.findById(id);
    if (!user) {
        throw new Error('User not found');
    }

    // Check if the project is already assigned
    if (user.assigned_projects.includes(data.project)) {
        throw new Error('Project already assigned to user');
    }

    user.assigned_projects.push(data.project);
    await user.save();

    return user.populate("assigned_projects");
}

const removeProjectFromUser = async (id, data) => {

    const user = await User.findById(id);
    if (!user) {
        throw new Error('User not found');
    }

    const projectIndex = user.assigned_projects.indexOf(data);
    if (projectIndex === -1) {
        throw new Error('Project not assigned to user');
    }

    user.assigned_projects.splice(projectIndex, 1);
    await user.save();
    return user;
}

module.exports = {
    createUser,
    getUser,
    getUsers,
    getFreeUsers,
    updateUser,
    deleteUser,
    getUserById,
    addProjectToUser,
    removeProjectFromUser,
    // getUserAssignedProjects
};
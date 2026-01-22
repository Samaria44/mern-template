const Role = require('../models/Role');
const User = require('../models/User');
const Permission = require('../models/Permission');
const bcrypt = require("bcryptjs");
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
        location: userData.location,
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
        .populate('location')
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
        location_name: populatedUser.location ? populatedUser.location.name : 'N/A',
        location: populatedUser.location ? populatedUser.location._id : 'N/A',
        role: populatedUser.roles[0].name,
        created_at: populatedUser.created_at
    };
};

const getUsers = async (query = {}) => {
    const users = await User.find({ 
        is_deleted: false,
        // active: true,
        ...query
    })
        .populate('department', 'name')
        .populate('location', 'name')
        .populate('roles', 'name');

    const transformedUsers = users
        .filter(user => user.roles.length > 0)
        .map(user => ({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            number: user.number,
            cnic: user.cnic,
            active: user.active,
            department_name: user.department ? user.department.name : 'N/A',
            department: user.department ? user.department._id : 'N/A',
            location_name: user.location ? user.location.name : 'N/A',
            location: user.location ? user.location._id : 'N/A',
            role: user.roles.map(role => role.name).join(', '),
            created_at: user.created_at
        }));

    return transformedUsers;
};

const getUser = async (id) => {
    // Find user by ID with populated fields
    const user = await User.findById(id)
        .populate('department', 'name')
        .populate('location', 'name')
        .populate('roles', 'name');
    
    // Only show active users by default
    if (!user?.active) {
        throw new Error('User is inactive');
    }

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
        location_name: user.location ? user.location.name : 'N/A',
        location: user.location ? user.location._id : 'N/A',
        role: user.roles.map(role => role.name).join(', '),
        created_at: user.created_at
    });

    // Return the transformed user data
    return transformedUser(user);
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
        .populate('location')
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
        active: populatedUser.active,
        cnic: populatedUser.cnic,
        department_name: populatedUser.department ? populatedUser.department.name : 'N/A',
        department: populatedUser.department ? populatedUser.department._id : 'N/A',
        location_name: populatedUser.location ? populatedUser.location.name : 'N/A',
        location: populatedUser.location ? populatedUser.location._id : 'N/A',
        role: populatedUser.roles[0].name,
        created_at: populatedUser.created_at
    };
};

const deleteUser = async (id, data) => {
    return await User.findByIdAndUpdate(id, data);
};

const toggleUserStatus = async (id) => {
    const user = await User.findById(id);
    if (!user) {
        throw new Error('User not found');
    }

    user.active = !user.active;
    await user.save();

    // Transform the user data
    const transformedUser = (user) => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        number: user.number,
        active: user.active,
        cnic: user.cnic,
        department_name: user.department ? user.department.name : 'N/A',
        department: user.department ? user.department._id : 'N/A',
        location_name: user.location ? user.location.name : 'N/A',
        location: user.location ? user.location._id : 'N/A',
        role: user.roles.map(role => role.name).join(', '),
        created_at: user.created_at
    });

    return transformedUser(user);
};

const getUserById = async (id) => {
    return await User.findById(id);
};


module.exports = {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    getUserById
};

const userService = require('../services/user');
const loginLogsService = require('../services/loginLog');

const createUser = async (req, res) => {
    try {
        // const { name, username, email, number, role } = req.body;
        const user = await userService.createUser({ ...req.body, created_by: req.userId });

        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await userService.getUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUsersloginlogs = async (req, res) => {
    try {
        const users = await loginLogsService.getUsersloginlogs(req.body);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userService.getUser(id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedUser = await userService.updateUser(id, { ...req.body, is_updated: true, updated_at: new Date(), updated_by: req.userId });

        res.status(201).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await userService.deleteUser(id, { is_deleted: true });
        res.json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const toggleUserStatus = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedUser = await userService.toggleUserStatus(id);
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createUser,
    getUser,
    getUsers,
    updateUser,
    deleteUser,
    toggleUserStatus,
    getUsersloginlogs
};
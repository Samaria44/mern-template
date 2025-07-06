const actionService = require('../services/action');
const createAction = async (req, res) => {
    try {
        const action = await actionService.createAction({ ...req.body, created_by: req.userId });

        res.status(201).json(action);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getActiveActions = async (req, res) => {
    try {
        const projects = await actionService.getActiveActions();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getActions = async (req, res) => {
    try {
        const actions = await actionService.getActions();
        res.json(actions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateAction = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedAction = await actionService.updateAction(id, { ...req.body, is_updated: true, updated_at: new Date(), updated_by: req.userId });

        res.status(201).json(updatedAction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteAction = async (req, res) => {
    const { id } = req.params;
    try {
        await actionService.deleteAction(id, { is_deleted: true, deleted_at: new Date(), deleted_by: req.userId});
        res.json({ message: 'Action deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createAction,
    getActions,
    getActiveActions,
    updateAction,
    deleteAction
};
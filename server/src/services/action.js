const Action = require('../models/Action');

const createAction = async (data) => {
    return await Action.create(data);
};

const getActions = async () => {
    return await Action.find({ is_deleted: false });
};

const getActiveActions = async () => {
    return await Action.find({ status: 'active', is_deleted: false });
};

const updateAction = async (id, data) => {
    return await Action.findByIdAndUpdate(id, data, { new: true });
};

const deleteAction = async (id, data) => {
    return await Action.findByIdAndUpdate(id, data);
};

module.exports = {
    createAction,
    getActions,
    getActiveActions,
    updateAction,
    deleteAction
};
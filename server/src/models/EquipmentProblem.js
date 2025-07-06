const mongoose = require('mongoose');

const equipmentProblemSchema = new mongoose.Schema({
    problem: String,
    state: String,

    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
    },

    device: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Device",
    },

    equipment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Equipment",
    },

    created_at: {
        type: Date,
        default: Date.now,
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    updated_at: Date,
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    is_updated: {
        type: Boolean,
        default: false
    },
    deleted_at: Date,
    deleted_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
});

const EquipmentProblem = mongoose.model('EquipmentProblem', equipmentProblemSchema);

module.exports = EquipmentProblem;
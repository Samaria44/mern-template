const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
    title: String,
    state: String,
    device: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Device",
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
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

const Equipment = mongoose.model('Equipment', equipmentSchema);

module.exports = Equipment;
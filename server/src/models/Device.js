
const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    location_id: String,
    name: String,
    state: String,
    type: String,
    severity: String,
    latitude: String,
    longitude: String,
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
    subEquipment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubEquipment",
    },
    equipmentProblem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EquipmentProblem",
    },
    assignTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    assign_at: {
        type: Date,
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

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;

const mongoose = require('mongoose');

const vehicleDeviceSchema = new mongoose.Schema({
    name: String,
    extension: String,
    state: String,
    isAssign: {
        type: Boolean,
        default: false
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

const VehicleDevice = mongoose.model('VehicleDevice', vehicleDeviceSchema);

module.exports = VehicleDevice;
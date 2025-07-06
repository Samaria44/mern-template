
const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    name: String,
    number: String,
    state: String,
    vehicleDevice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "VehicleDevice"
    },
    isAssigned: {
        type: Boolean,
        default: false,
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

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
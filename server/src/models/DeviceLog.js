
const mongoose = require('mongoose');

const deviceLogSchema = new mongoose.Schema({
    ip: String,
    mac: String,
    time: String,
    temperature: String,
    humidity: String,
    door: String,
    ac_v: String,
    dc_v: String,
    deviceId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Device",
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

const DeviceLog = mongoose.model('DeviceLog', deviceLogSchema);

module.exports = DeviceLog;
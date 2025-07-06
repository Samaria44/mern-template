
const mongoose = require('mongoose');

const TeamLogInLogSchema = new mongoose.Schema({
    login_at: {
        type: Date,
        default: Date.now,
        required: true
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
    },
    created_at: {
        type: Date,
        default: Date.now,
        // required: true
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

const TeamLogInLog = mongoose.model('TeamLogInLog', TeamLogInLogSchema);

module.exports = TeamLogInLog;
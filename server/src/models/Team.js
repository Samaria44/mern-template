
const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: String,
    state: String,
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TeamMember"
        }
    ],
    username: String,
    password: {
        type: String,
        required: true
    },
    roles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        }
    ],
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle"
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationCode: {
        type: String,
        default: null
    },
    mac: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: null
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
    last_login: Date,
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

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
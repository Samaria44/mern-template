
const mongoose = require('mongoose');

const complainSchema = new mongoose.Schema({
    complainNumber: String,
    description: String,
    state: String,
    status: {
        type: String,
        default: "pending",
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
    },
    device: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Device",
    },
    equipment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Equipment",
    }],
    subEquipment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubEquipment",
    },
    equipmentProblem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EquipmentProblem",
    },
    generated_from: {
        type: String,
        default: "own",
    },
    assignTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
    },
    assignAt: Date,
    closedAt: Date,
    type: String,
    severity: String,
    visible: {
        type: Boolean,
        default: false
    },
    site_up_at: Date,
    site_down_at: Date,
    initiator: String,
    action_taken: String,
    action_taken_by: String,
    remarks: String,
    logs: [{
        status: {
            type: String,
        },
        resolvers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "TeamMember",
        }],
        action: {
            type: String,
        },
        remarks: {
            type: String,
        },
        updated_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        updated_at: {
            type: Date,
            default: Date.now,
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        created_at: {
            type: Date,
            default: Date.now,
            required: true,
        },
        filePaths: [{ type: String }]
    }],

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

const Complain = mongoose.model('Complain', complainSchema);

module.exports = Complain;
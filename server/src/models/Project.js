
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: String,
    state: String,
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

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
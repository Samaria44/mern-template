const mongoose = require('mongoose');

const entitySchema = new mongoose.Schema({
    name: String,
    description: String,
    type: String,
    created_at: {
        type: Date,
        default: Date.now,
    },
    active: {
        type: Boolean,
        default: true
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

const Entity = mongoose.model('Entity', entitySchema);

module.exports = Entity;

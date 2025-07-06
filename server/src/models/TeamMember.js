const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    cnic: {
        type: String,
        unique: true,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true,
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    updated_at: Date,
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    is_updated: {
        type: Boolean,
        default: false,
    },
    deleted_at: Date,
    deleted_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    is_deleted: {
        type: Boolean,
        default: false,
    },
});

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

module.exports = TeamMember;

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // firstName: String,
    // lastName: String,
    number: String,
    name: String,
    username: String,
    cnic: String,
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
    },
    roles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        }
    ],
    created_at: {
        type: Date,
        default: Date.now,
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    updated_at: Date,
    last_login: Date,
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

const User = mongoose.model('User', userSchema);

module.exports = User;

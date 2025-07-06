

const mongoose = require('mongoose');

const entities = ['project', 'complain', 'vehicle', 'user', 'permission', 'department', 'device', "equipment", "subEquipment", "equipmentProblem", "team", "teamMember", "reason"];
const roles = ['create', 'read', 'update', 'delete', 'read_self'];

const permissionsSchemaFields = {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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

};

entities.forEach(entity => {
    permissionsSchemaFields[entity] = {};
    roles.forEach(role => {
        if (role == 'read_self') {
            if (entity == 'complain') {
                permissionsSchemaFields[entity][role] = {
                    type: Boolean,
                    default: false
                };
            }
        } else {
            permissionsSchemaFields[entity][role] = {
                type: Boolean,
                default: false
            };
        }
    });
});

const permissionsSchema = new mongoose.Schema(permissionsSchemaFields);

const Permission = mongoose.model('Permission', permissionsSchema);
module.exports = Permission;

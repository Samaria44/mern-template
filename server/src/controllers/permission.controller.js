const permissionService = require('../services/permission');
const createPermission = async (req, res) => {
    try {
        const permission = await permissionService.createPermission({ ...req.body, created_by: req.userId });

        res.status(201).json(permission);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// const getPermissions = async (req, res) => {
//     try {
//         const permissions = await permissionService.getPermissions();
//         res.json(permissions);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
// const getActivePermissions = async (req, res) => {
//     try {
//         const permissions = await permissionService.getActivePermissions();
//         res.json(permissions);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

const updatePermission = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedPermission = await permissionService.updatePermission(id, { ...req.body, is_updated: true, updated_at: new Date(), updated_by: req.userId });

        res.status(201).json(updatedPermission);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getUserPermissions = async (req, res) => {
    const { id } = req.params;
    try {
        const permissions = await permissionService.getPermissionById(id);
        // console.log(permissions)

        if (permissions) {
            const {
                created_at,
                is_deleted,
                is_updated,
                updated_at,
                updated_by,
                created_by,
                ...filteredPermissions
            } = permissions.toObject();

            res.json(filteredPermissions);
        } else {
            res.json({});
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPermission,
    // getPermissions,
    // getActivePermissions,
    getUserPermissions,
    updatePermission,
    // deletePermission
};
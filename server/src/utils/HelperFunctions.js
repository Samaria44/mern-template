// const entities = require("../constant");
// const roles = require("../constant");

const { entities, roles } = require("../constant");

const generatePermissions = (allow) => {
    const permissions = {};
    // console.log(entities);
    entities.forEach(entity => {
        permissions[entity] = {};
        // console.log(entity, roles);
        roles.forEach(role => {
            if (role == 'read_self') {
                if (entity == 'complain') {
                    permissions[entity][role] = allow;
                }
            } else {
                permissions[entity][role] = allow;
            }
        });
    });

    return permissions;
}


// const checkPermission = (entity, action) => {
//     // console.log("checkPermission ")
//     // return async (req, res, next) => {
//       try {
//         const UserID = getUserIdFromJwt(req.headers["authorization"]);
//         const user = await User.findById(UserID).populate('roles');
//         const permissions = await Permissions.findOne({ userId: user._id });
//         if (user.roles != 'admin' || user.roles != 'super admin') {
//           if (!user || !permissions[entity][action]) {
//             return res.status(403).json({ message: 'Access denied' });
//           }
//         }
//         next();
//       } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: 'Server error' });
//       }
//     // }
//   };

function generateRandomCode() {
    // Generate a random number between 100000 and 999999
    const code = Math.floor(100000 + Math.random() * 900000);
    return code.toString();  // Return the code as a string
}


function generateCompactUniqueCode(length = 8) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const timestamp = Date.now().toString(36).toUpperCase(); // Compact base-36 representation of timestamp
    let randomCode = '';

    for (let i = 0; i < length - timestamp.length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        randomCode += charset[randomIndex];
    }

    // Combine timestamp with the random string
    return `${timestamp}${randomCode}`;
}

// Example Usage
// console.log(generateCompactUniqueCode()); // Example: "l4n8yG7B"

module.exports = {
    generatePermissions,
    generateRandomCode,
    generateCompactUniqueCode
};

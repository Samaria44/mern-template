const config = require("../config/auth.config");
const db = require("../models");
const { user: User, role: Role, refreshToken: RefreshToken } = db;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Permission = require("../models/Permission");
const { getUserIdFromJwt } = require("../middleware/authMiddleware");
const {  createUserLogInLog } = require("../services/loginLog");

exports.signup = async (req, res) => {
    try {
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(req.body.email + "@123", 8),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            created_by: req.body.created_by
        });

        const savedUser = await user.save();

        if (req.body.roles) {
            const roles = await Role.find({
                name: { $in: req.body.roles },
            });

            savedUser.roles = roles.map(role => role._id);
        } else {
            const role = await Role.findOne({ name: "user" });
            savedUser.roles = [role._id];
        }

        await savedUser.save();
        res.send({ id: savedUser.id, message: "User was registered successfully!" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.signin = async (req, res) => {
    try {
        // Find user by email
        const user = await User.findOne({ email: req.body.email }).populate("roles", "-__v").exec();

        // Check if user exists
        if (!user) {
            return res.status(404).send({ message: "Invalid Email or Password!" });
        }

        // Check if password is valid
        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            return res.status(404).send({ message: "Invalid Email or Password!" });
        }

        user.last_login = new Date();
        await user.save();

        await createUserLogInLog({
            login_at: new Date(),
            user: user._id,
            created_at: new Date(),
            created_by: user._id
        })

        // Find permissions associated with the user
        const permissions = await Permission.findOne({ userId: user._id.toString() });

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, roles: user.roles, permissions: permissions },
            config.secret,
            { expiresIn: config.jwtExpiration }
        );

        // Generate refresh token
        const refreshToken = await RefreshToken.createToken(user);

        // Prepare user roles
        const authorities = user.roles.map(role => `ROLE_${role.name.toUpperCase()}`);

        // Send response
        return res.status(200).send({
            id: user._id,
            email: user.email,
            name: user.name,
            roles: authorities,
            permissions: permissions,
            last_login: user.last_login,
            accessToken: token,
            refreshToken: refreshToken,
        });

    } catch (err) {
        // Handle server errors
        return res.status(500).send({ message: err.message });
    }
};

// {
//     "email":"test@test.com",
//     "password":"Test@123"
// }
exports.updatePassword = async (req, res) => {
    try {

        let token = req.headers["authorization"];

        // console.log("token",token);
        // console.log("token", token);
        if (!token) {
            return res.status(403).send({ message: "No token provided!" });
        }

        // Remove the "Bearer " prefix if present
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length);
        }
        // const accessToken = req.headers["authorization"];
        const decodedToken = jwt.verify(token, config.secret);
        const userId = decodedToken.id;
        // console.log("userId",userId)
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        const passwordIsValid = bcrypt.compareSync(req.body.currentPassword, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({ message: "Invalid current password" });
        }

        const newPassword = bcrypt.hashSync(req.body.newPassword, 8);

        user.password = newPassword;
        await user.save();
        res.status(200).send({ message: "Password was updated successfully!" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        // Find user by email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Generate reset token
        const resetToken = jwt.sign({ id: user._id }, config.secret, { expiresIn: '1h' });

        // Update user document with reset token and expiration time
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        res.send({ message: "Password reset token generated successfully" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        // Find user by reset token
        const user = await User.findOne({ resetPasswordToken: req.params.token });
        if (!user) {
            return res.status(404).send({ message: "Invalid or expired reset token" });
        }

        // Check if reset token has expired
        if (user.resetPasswordExpires < Date.now()) {
            return res.status(400).send({ message: "Reset token has expired" });
        }

        // Update user password
        const newPassword = bcrypt.hashSync(req.body.newPassword, 8);
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.send({ message: "Password reset successfully" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.getUserIdFromToken = (token) => {
    try {
        // Decode the JWT token
        const decoded = jwt.verify(token, config.secret);

        // Extract and return the user ID
        return decoded.id;

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token has expired');
        } else if (error.name === 'JsonWebTokenError') {
            throw new Error('Invalid token');
        } else {
            throw error;
        }
    }
}

exports.refreshToken = async (req, res) => {
    const { refreshToken: requestToken } = req.body;
    // let id = getUserIdFromJwt(accessToken);
    // const user = await User.findById(id)
    if (!requestToken) {
        return res.status(403).json({ message: "Refresh Token is required!" });
    }

    try {
        const refreshToken = await RefreshToken.findOne({ token: requestToken });

        if (!refreshToken) {
            return res.status(403).json({ message: "Refresh token is not in database!" });
        }

        const user = await User.findById(refreshToken.user).populate({
            path: 'roles',
            select: 'name'
        });

        if (RefreshToken.verifyExpiration(refreshToken)) {
            await RefreshToken.findByIdAndDelete(refreshToken._id).exec();
            // await RefreshToken.findByIdAndDelete(refreshToken._id, { useFindAndModify: false }).exec();

            return res.status(403).json({
                message: "Refresh token was expired. Please make a new signin request",
            });
        }

        const permissions = await Permission.findOne({ userId: user._id.toString() });

        // { id: user._id, roles: user.roles, permissions: permissions },
        const newAccessToken = jwt.sign(
            { id: refreshToken.user._id, roles: user.roles, permissions: permissions },
            config.secret,
            { expiresIn: config.jwtExpiration }
        );

        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: refreshToken.token,
        });
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};

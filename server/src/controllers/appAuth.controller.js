const config = require("../config/auth.config");
const db = require("../models");
const { user: User, role: Role, refreshToken: RefreshToken } = db;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Permission = require("../models/Permission");
const { getUserIdFromJwt } = require("../middleware/authMiddleware");
const Team = require("../models/Team");
const { generateRandomCode } = require("../utils/HelperFunctions");
const { createTeamLogInLog } = require("../services/loginLog");



exports.signin = async (req, res) => {
    try {
        console.log("req.body", req.body)
        const team = await Team.findOne({ username: req.body.username }).populate("roles", "-__v").exec();;


        if (!team) {
            return res.status(404).send({ message: "Invalid Username or Password!" });
        }

        if (team.token) {
            console.log("team.token: ", team.token);
            console.log("req.body.token: ", req.body.token);
            if (team.token !== req.body.token) {
                return res.status(403).send({ message: "Already logged in on another device." });
            }
        }

        team.last_login = new Date();
        await team.save();

        const passwordIsValid = bcrypt.compareSync(req.body.password, team.password);
        if (!passwordIsValid) {
            return res.status(404).send({ message: "Invalid Username or Password!" });
        }

        await createTeamLogInLog({
            login_at: new Date(),
            team: team._id,
            created_at: new Date(),
            // created_by: team._id
        })


        const token = jwt.sign(
            { id: team.id, roles: team.roles },
            config.secret,
            { expiresIn: config.jwtExpiration }
        );

        const refreshToken = await RefreshToken.createToken(team);

        const authorities = team.roles.map(role => `ROLE_${role.name.toUpperCase()}`);
        const newResponse = {
            id: team._id,
            name: team.name,
            roles: authorities,
            isVerified: team.isVerified,
            accessToken: token,
            refreshToken: refreshToken,
        }
        if (team.isVerified) {
            return res.status(200).send(newResponse);
        } else {
            return res.status(201).send(newResponse);
        }
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const data = req.body;
        // console.log("data",data)
        const newPassword = bcrypt.hashSync(data.newPassword, 8);
        const updatedTeam = await Team.findByIdAndUpdate(
            data._id,
            {
                $set: {
                    password: newPassword
                }
            },
            { new: true }
        );
        if (!updatedTeam) {
            return { success: false, message: 'Team not found.' };
        }
        return res.send({ message: "Password reset successfully" });

    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
}

exports.verificationCode = async (req, res) => {
    try {
        // console.log("req.body",req.body)
        const code = generateRandomCode();
        const data = req.body;
        const updatedTeam = await Team.findByIdAndUpdate(
            data._id,
            {
                $set: {
                    verificationCode: code
                }
            },
            { new: true }
        );
        if (!updatedTeam) {
            return { success: false, message: 'Team not found.' };
        }
        return res.status(201).json({ code: code });
        // return res.status(201).json("updatedTeam");

    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
}

exports.verifyCode = async (req, res) => {
    try {
        const data = req.body;
        console.log("...data", data);
        const team = await Team.findOne({ _id: data._id, verificationCode: data.code });
        // console.log(team);
        if (team) {

            const updatedTeam = await Team.findByIdAndUpdate(
                data._id,
                {
                    $set: {
                        mac: data.mac,
                        token: data.token,
                        isVerified: true,
                        verificationCode: null
                    }
                },
                { new: true }
            );

            return res.status(200).json(updatedTeam);
        }
        // return res.status(201).json("updatedTeam");
        return res.status(500).send({ message: "Not a valid code!!" });

    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
}

exports.clearVerification = async (req, res) => {
    try {
        const data = req.body;
        console.log("...data", data);
        const team = await Team.findOne({ _id: data._id });
        // console.log(team);
        if (team) {

            const updatedTeam = await Team.findByIdAndUpdate(
                data._id,
                {
                    $set: {
                        mac: null,
                        token: null,
                        isVerified: false,
                        verificationCode: null
                    }
                },
                { new: true }
            );

            return res.status(200).json(updatedTeam);
        }
        // return res.status(201).json("updatedTeam");
        return res.status(500).send({ message: "Not a valid team!!" });

    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
}

exports.refreshToken = async (req, res) => {
    const { refreshToken: requestToken } = req.body;
    if (!requestToken) {
        return res.status(403).json({ message: "Refresh Token is required!" });
    }

    try {
        const refreshToken = await RefreshToken.findOne({ token: requestToken });

        if (!refreshToken) {
            return res.status(403).json({ message: "Refresh token is not in database!" });
        }

        const user = await Team.findById(refreshToken.user).populate({
            path: 'roles',
            select: 'name'
        });

        if (RefreshToken.verifyExpiration(refreshToken)) {
            await RefreshToken.findByIdAndDelete(refreshToken._id, { useFindAndModify: false }).exec();

            return res.status(403).json({
                message: "Refresh token was expired. Please make a new signin request",
            });
        }
        
        const newAccessToken = jwt.sign(
            { id: user._id, roles: user.roles },
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


// {
//     "_id": "66e3eea18867fd353a37b65f",
//     "code": "658331",
//     "mac": "01-23-45-67-89-ab"
// }
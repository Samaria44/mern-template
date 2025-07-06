const UserLogInLog = require("../models/UserLogInLogs");

const createUserLogInLog = async (data) => {
    const logInLog = await UserLogInLog.create(data);
    return logInLog;
};

const getUsersloginlogs = async (query) => {
    // console.log("query", query)
    const filters = {};

    // if (query?.login_at) {
    //     filters.login_at = new Date(query.login_at);
    // }

    // if (query?.team) {
    //     filters.team = query.team;
    // }

    if (query?.from && query?.to) {
        filters.created_at = {
            $gte: new Date(query.from),
            $lte: new Date(query.to),
        };
    } else if (query?.from) {
        filters.created_at = {
            $gte: new Date(query.from),
        };
    } else if (query?.to) {
        filters.created_at = {
            $lte: new Date(query.to),
        };
    }
    const logs = await UserLogInLog.find(filters).populate("user");
    return logs;
};


const getTeamsloginlogs = async (query) => {
    // console.log("query", query)
    const filters = {};

    // if (query?.login_at) {
    //     filters.login_at = new Date(query.login_at);
    // }

    // if (query?.team) {
    //     filters.team = query.team;
    // }

    if (query?.from && query?.to) {
        filters.created_at = {
            $gte: new Date(query.from),
            $lte: new Date(query.to),
        };
    } else if (query?.from) {
        filters.created_at = {
            $gte: new Date(query.from),
        };
    } else if (query?.to) {
        filters.created_at = {
            $lte: new Date(query.to),
        };
    }
    const logs = await TeamLogInLog.find(filters).populate("team");
    return logs;
};

module.exports = {
    createUserLogInLog,
    getUsersloginlogs,
    getTeamsloginlogs
};
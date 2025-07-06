import { useAuth } from "../contexts/authContext";
import { fetchApi } from "./utils";


export const userService = {
    getUsers: async () => {
        try {
            const res = await fetchApi("users", "GET");
            return res;
        } catch (error) {
            return error;
        }
    },
    getUsersLoginLogs: async (data) => {
        try {
            const res = await fetchApi("users/login-logs", "POST", data);
            return res;
        } catch (error) {
            return error;
        }
    },
    getUser: async (user) => {
        try {
            const res = await fetchApi("users/" + user, "GET");
            return res;
        } catch (error) {
            return error;
        }
    },
    updateUser: async (_id, data) => {
        try {
            const res = await fetchApi("users/" + _id, "PUT", data);
            return res;
        } catch (error) {
            return error;
        }
    },
    updateUserStatus: async (_id, data) => {
        try {
            const res = await fetchApi("users/" + _id + "/toggle-status", "PUT", data);
            return res;
        } catch (error) {
            return error;
        }
    },
    createUser: async (data) => {
        try {
            const res = await fetchApi("users", "POST", data);
            return res;
        } catch (error) {
            return error;
        }
    },
    deleteUsers: async (_id) => {
        try {
            const res = await fetchApi("users/" + _id, "DELETE");
            return res;
        } catch (error) {
            return error;
        }
    },
}

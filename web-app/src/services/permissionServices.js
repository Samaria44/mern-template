// permission

import { fetchApi } from "./utils";

export const permissionService = {
    getUserPermission: async (_id) => {
        try {
            const res = await fetchApi("permission/" + _id, "GET");
            return res;
        } catch (error) {
            return error;
        }
    },
    createPermission: async (permissionData) => {
        try {
            const res = await fetchApi("permission", "POST", permissionData);
            return res;
        } catch (error) {
            return error;
        }
    },
    updatePermission: async (_id, permissionData) => {
        try {
            const res = await fetchApi("permission/" + _id, "PUT", permissionData);
            return res;
        } catch (error) {
            return error;
        }
    },
}
import { fetchApi } from "./utils";

export const departmentService = {
    getDepartments: async () => {
        try {
            const res = await fetchApi("departments", "GET");
            return res;
        } catch (error) {
            return error;
        }
    },
    getActiveDepartments: async () => {
        try {
            const res = await fetchApi("departments/active", "GET");
            return res;
        } catch (error) {
            return error;
        }
    },
    updateDepartment: async (_id, DepartmentData) => {
        try {
            const res = await fetchApi("departments/" + _id, "PUT", DepartmentData);
            return res;
        } catch (error) {
            return error;
        }
    },
    createDepartment: async (DepartmentData) => {
        try {
            const res = await fetchApi("departments", "POST", DepartmentData);
            return res;
        } catch (error) {
            return error;
        }
    },
    deleteDepartments: async (_id) => {
        try {
            const res = await fetchApi("departments/" + _id, "DELETE");
            return res;
        } catch (error) {
            return error;
        }
    },
}

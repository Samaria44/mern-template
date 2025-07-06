import { fetchApi } from "./utils";

export const projectService = {
    getProjects: async () => {
        try {
            const res = await fetchApi("projects", "GET");
            return res;
        } catch (error) {
            return error;
        }
    },
    getActiveProjects: async () => {
        try {
            const res = await fetchApi("projects/active", "GET");
            return res;
        } catch (error) {
            return error;
        }
    },
    updateProject: async (_id, ProjectData) => {
        try {
            const res = await fetchApi("projects/" + _id, "PUT", ProjectData);
            return res;
        } catch (error) {
            return error;
        }
    },
    createProject: async (ProjectData) => {
        try {
            const res = await fetchApi("projects", "POST", ProjectData);
            return res;
        } catch (error) {
            return error;
        }
    },
    deleteProjects: async (_id) => {
        try {
            const res = await fetchApi("projects/" + _id, "DELETE");
            return res;
        } catch (error) {
            return error;
        }
    },
}

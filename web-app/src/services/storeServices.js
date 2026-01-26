import { fetchApi } from "./utils";

export const storeService = {
  getStores: async () => {
    try {
      const res = await fetchApi("stores", "GET");
      return res.data;
    } catch (error) {
      console.error("Failed to fetch stores:", error);
      throw error;
    }
  },

  createStore: async (data) => {
    try {
      const res = await fetchApi("stores", "POST", data);
      return res.data;
    } catch (error) {
      console.error("Failed to create store:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
      }
      throw error;
    }
  },

  updateStore: async (_id, data) => {
    try {
      const res = await fetchApi(`stores/${_id}`, "PUT", data);
      return res.data;
    } catch (error) {
      console.error("Failed to update store:", error);
      throw error;
    }
  },

  deleteStore: async (_id) => {
    try {
      const res = await fetchApi(`stores/${_id}`, "DELETE");
      return res.data;
    } catch (error) {
      console.error("Failed to delete store:", error);
      throw error;
    }
  },
  getStoreById: async (id) => {
    try {
      const res = await fetchApi(`stores/${id}`, "GET");
      return res.data;
    } catch (error) {
      console.error("Failed to fetch store by ID:", error);
      throw error;
    }
  },
  getStoreByCode: async (code) => {
    try {
      const res = await fetchApi(`stores/code/${code}`, "GET");
      return res.data;
    } catch (error) {
      console.error("Failed to fetch store by code:", error);
      throw error;
    }
  },
  getProfitAnalytics: async (timeRange = 'daily') => {
    try {
      const res = await fetchApi(`stores/analytics?timeRange=${timeRange}`, "GET");
      return res.data;
    } catch (error) {
      console.error("Failed to fetch profit analytics:", error);
      throw error;
    }
  },
};

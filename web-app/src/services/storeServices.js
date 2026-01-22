import { fetchApi } from "./utils";

export const storeService = {
  getStores: async () => {
    const res = await fetchApi("stores", "GET");
    return res.data;
  },

  createStore: async (data) => {
    const res = await fetchApi("stores", "POST", data);
    return res.data;
  },

  updateStore: async (_id, data) => {
    const res = await fetchApi(`stores/${_id}`, "PUT", data);
    return res.data;
  },

  deleteStore: async (_id) => {
    const res = await fetchApi(`stores/${_id}`, "DELETE");
    return res.data;
  },
  getStoreById: async (id) => {
    const res = await fetchApi(`stores/${id}`, "GET");
    return res.data;
  },
  getStoreByCode: async (code) => {
    const res = await fetchApi(`stores/code/${code}`, "GET");
    return res.data;
  },
  getProfitAnalytics: async (timeRange = 'daily') => {
    const res = await fetchApi(`stores/analytics?timeRange=${timeRange}`, "GET");
    return res.data;
  },
};

// src/services/locationService.js
import { fetchApi } from "./utils";

export const locationService = {
  getLocations: async () => {
    try {
      const res = await fetchApi("locations", "GET");
      return res.data; // Axios response data
    } catch (error) {
      console.error("Failed to fetch locations", error);
      throw error; // Throw to handle in component
    }
  },

  getActiveLocations: async () => {
    try {
      const res = await fetchApi("locations/active", "GET");
      return res.data;
    } catch (error) {
      console.error("Failed to fetch active locations", error);
      throw error;
    }
  },

  createLocation: async (locationData) => {
    try {
      console.log("Sending location payload:", locationData); // Debug payload
      const res = await fetchApi("locations", "POST", locationData);
      return res.data;
    } catch (error) {
      console.error("Failed to create location", error);
      throw error;
    }
  },

  updateLocation: async (_id, locationData) => {
    try {
      const res = await fetchApi(`locations/${_id}`, "PUT", locationData);
      return res.data;
    } catch (error) {
      console.error("Failed to update location", error);
      throw error;
    }
  },

  deleteLocation: async (_id) => {
    try {
      const res = await fetchApi(`locations/${_id}`, "DELETE");
      return res.data;
    } catch (error) {
      console.error("Failed to delete location", error);
      throw error;
    }
  },
};

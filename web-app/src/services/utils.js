import axios from "axios";
import { redirectToLogin } from "../utils/helperFunctions";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}`;

export const fetchApi = async (endpoint, method, body, headers, formData = false) => {
    try {
        const token = localStorage.getItem("token");

        const combinedHeaders = {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
            ...headers,
        };

        const combinedHeadersForFormData = {
            // "Content-Type": "multipart/form-data",
            Authorization: token ? `Bearer ${token}` : "",
            Accept: "application/json",
            ...headers, // Merge any other headers you need
        };

        const response = await axios({
            method: method,
            url: `${BASE_URL}${endpoint}`,
            headers: formData ? combinedHeadersForFormData : combinedHeaders,
            data: body,
        });

        return response;
    } catch (error) {

        // console.log("Error:", error);

        if (error.response && error.response.status === 401) {
            console.log("Token expired, attempting to refresh...");

            // Try to refresh the token
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
                // console.log("getting refresh token")
                try {
                    const refreshResponse = await axios.post(
                        `${BASE_URL}auth/refresh-token`,
                        { refreshToken }
                    );

                    const newToken = refreshResponse.data.accessToken;
                    localStorage.setItem("token", newToken);

                    // Retry the original request with the new token 
                    return axios({
                        method: method,
                        url: `${BASE_URL}${endpoint}`,
                        headers: {
                            ...headers,
                            Authorization: `Bearer ${newToken}`,
                        },
                        data: body,
                    });
                } catch (refreshError) {
                    console.log("Refresh token failed:", refreshError);
                    redirectToLogin();
                    return Promise.reject(refreshError);
                }
            } else {
                // No refresh token available, force logout
                redirectToLogin();
                console.log("Auto logout due to missing refresh token.");
                return Promise.reject(error);
            }
        }

        // Return the original error if it's not a 401 or refresh token fails
        return Promise.reject(error);
    }
};

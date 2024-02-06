import axios from "axios";

const apiInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // timeout: 10000,
  withCredentials: true,
});

export const HttpGet = async (url, params = null) => {
  try {
    const response = await apiInstance.get(url, { params });
    console.log("GET request sent to:", response.config.url);

    return response.data;
  } catch (error) {
    console.error("Error in HttpGet:", error);
    throw error;
  }
};

export const HttpPost = async (url, data, params = null) => {
  try {
    const response = await apiInstance.post(url, data, { params });
    console.log("POST request sent to:", response.config.url);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const HttpPut = async (url, data, params = null) => {
  try {
    const response = await apiInstance.put(url, data, { params });
    console.log("PUT request sent to:", response.config.url);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const HttpDelete = async (url, params = null) => {
  try {
    const response = await apiInstance.delete(url, { params });
    console.log("DELETE request sent to:", response.config.url);

    return response.data;
  } catch (error) {
    throw error;
  }
};

import axios from "axios";

const apiInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // timeout: 10000,
  withCredentials: true,
});

const apiInstance2 = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true,
});

export const HttpGet = async (url, params = null) => {
  try {
    const response = await apiInstance.get(url, { params });
    // console.log("GET request sent to:", response.config.url);

    return response.data;
  } catch (error) {
    console.error("Error in HttpGet:", error);
    throw error;
  }
};

export const HttpPost = async (url, data, params = null) => {
  try {
    const response = await apiInstance.post(url, data, { params });
    // console.log("POST request sent to:", response.config.url);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const HttpPut = async (url, data, params = null) => {
  try {
    const response = await apiInstance.put(url, data, { params });
    // console.log("PUT request sent to:", response.config.url);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const HttpDelete = async (url, params = null) => {
  try {
    const response = await apiInstance.delete(url, { params });
    // console.log("DELETE request sent to:", response.config.url);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const HttpPostWithFile = async (url, jsonData, files) => {
  try {
    const formData = new FormData();

    const dataBlob = new Blob([JSON.stringify(jsonData)], {
      type: "application/json",
    });
    formData.append("data", dataBlob);

    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await apiInstance2.post(url, formData);

    // console.log("POST request (with file) sent to:", response.config.url);
    // console.log("Response Data:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const HttpPutWithFile = async (url, jsonData, files) => {
  try {
    const formData = new FormData();

    const dataBlob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
    formData.append('data', dataBlob);

    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await apiInstance2.put(url, formData);

    console.log("PUT request (with file) sent to:", response.config.url);
    console.log("Response Data:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

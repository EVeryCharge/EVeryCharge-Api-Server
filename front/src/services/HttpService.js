import axios from 'axios';

const apiInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

export const HttpGet = async (url, params=null) => {
  try {
    const response = await apiInstance.get(url, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const HttpPost = async (url, data, params=null) => {
  try {
    const response = await apiInstance.post(url, data, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

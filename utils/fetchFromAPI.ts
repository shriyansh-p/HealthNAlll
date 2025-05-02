import axios from "axios";

const BASE_URL = "https://trackapi.nutritionix.com/v2";
const APP_ID = "94f6030d"; // Get from https://developer.nutritionix.com/
const APP_KEY = "19fc1c199bb2c22a1bf172644b8245e8"; 

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "x-app-id": APP_ID,
    "x-app-key": APP_KEY,
    "Content-Type": "application/json"
  },
});

export const fetchFromAPI = async (endpoint, params = {}) => {
  try {
    const response = await axiosInstance.get(`/${endpoint}`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching data from Nutritionix API:", error);
    throw error;
  }
};

export default fetchFromAPI;
import axios from "axios";

const BASE_URL = "https://world.openfoodfacts.org";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchFromAPI = async (endpoint: string, params = {}) => {
  try {
    const response = await axiosInstance.get(endpoint, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching data from Open Food Facts API:", error);
    throw error;
  }
};

export default fetchFromAPI;

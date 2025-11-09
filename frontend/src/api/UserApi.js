import axios from "axios";

// Base URL from Vite environment variable
const API = import.meta.env.VITE_API_URL;

// Create reusable Axios instance
const api = axios.create({
  baseURL: API,
  withCredentials: true, // needed if you use cookies for auth
});

// ----------------- User API functions -----------------

// Get current logged-in user
export const getCurrentUser = async () => {
  try {
    const response = await api.get("/api/v1/users/current-user");
    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};

// Login user
export const loginUser = async (loginData) => {
  try {
    const response = await api.post("/api/v1/users/login", loginData);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

// Register user
export const registerUser = async (registerData) => {
  try {
    const response = await api.post("/api/v1/users/register", registerData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    const response = await api.post("/api/v1/users/logout");
    return response.data;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export default api;

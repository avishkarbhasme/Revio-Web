import axios from "axios";

// Base Axios instance
const api = axios.create({
  baseURL: "/api/users", // Change if your API prefix differs
  withCredentials: true, // Include cookies if needed
});

// Helper to set Authorization header if required
function setAuth(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

// Register user (with avatar/coverImage upload)
export function registerUser(formData) {
  // formData should be FormData instance with avatar/coverImage fields
  return api.post("/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

// Login user
export function loginUser(payload) {
  return api.post("/login", payload);
}

// Forgot password (secured, token required)
export function forgotPassword(payload, token) {
  setAuth(token);
  return api.post("/forgot-password", payload);
}

// Logout user (secured)
export function logoutUser(token) {
  setAuth(token);
  return api.post("/logout");
}

// Refresh access token
export function refreshAccessToken(payload) {
  return api.post("/refresh-token", payload);
}

// Change password (secured)
export function changeCurrentPassword(payload, token) {
  setAuth(token);
  return api.post("/change-password", payload);
}

// Get current user (secured)
export function getCurrentUser(token) {
  setAuth(token);
  return api.get("/current-user");
}

// Update account details (secured)
export function updateAccountDetails(payload, token) {
  setAuth(token);
  return api.patch("/update-account", payload);
}

// Update avatar (secured, single file upload)
export function updateUserAvatar(avatarFile, token) {
  setAuth(token);
  const fd = new FormData();
  fd.append("avatar", avatarFile);
  return api.patch("/avatar", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

// Update cover image (secured, single file upload)
export function updateUserCoverImage(coverImageFile, token) {
  setAuth(token);
  const fd = new FormData();
  fd.append("coverImage", coverImageFile);
  return api.patch("/cover-image", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

// Get user channel profile by username (secured)
export function getUserChannelProfile(username, token) {
  setAuth(token);
  return api.get(`/c/${username}`);
}

// Get user watch history (secured)
export function getWatchHistory(token) {
  setAuth(token);
  return api.get("/watch-history");
}

export default {
  registerUser,
  loginUser,
  forgotPassword,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};

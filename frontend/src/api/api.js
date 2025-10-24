import axios from "axios";


export const fetchedlogin = async () => {
  const res = await axios.get(`/api/v1/login`);
  return res.data;
};

// export const fetchVideoById = async (id) => {
//   const res = await axios.get(`${API_BASE}/videos/${id}`);
//   return res.data;
// };

// export const searchVideos = async (query) => {
//   const res = await axios.get(`${API_BASE}/videos/search?query=${query}`);
//   return res.data;
// };

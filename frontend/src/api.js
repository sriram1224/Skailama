import axios from "axios";

// Use explicit env var when available; fall back to the deployed URL provided
// by the user or localhost for dev. Set REACT_APP_API_BASE in your .env when
// running the frontend in different environments.
const baseURL =
  process.env.REACT_APP_API_BASE || "https://skailama-9zm6.onrender.com/api";

const API = axios.create({ baseURL });

export default API;

export const getProfiles = () => API.get("/profiles");
export const createProfile = (data) => API.post("/profiles", data);
export const getEvents = (profileId) => API.get(`/events/${profileId}`);
export const createEvent = (data) => API.post("/events", data);
export const updateEvent = (id, data) => API.put(`/events/${id}`, data);

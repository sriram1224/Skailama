import axios from "axios";
const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const getProfiles = () => API.get("/profiles");
export const createProfile = (data) => API.post("/users", data);
export const getEvents = (profileId) => API.get(`/events/${profileId}`);
export const createEvent = (data) => API.post("/events", data);
export const updateEvent = (id, data) => API.put(`/events/${id}`, data);

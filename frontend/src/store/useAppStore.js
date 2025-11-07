import { create } from "zustand";
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const useAppStore = create((set, get) => ({
  profiles: [],
  activeProfile: null,
  timezone: "Asia/Kolkata",
  events: [],

  // Load all profiles
  fetchProfiles: async () => {
    const { data } = await API.get("/profiles");
    set({ profiles: data });
  },

  // Switch active profile
  setActiveProfile: (profileId) => set({ activeProfile: profileId }),

  // Set timezone
  setTimezone: (tz) => set({ timezone: tz }),

  // Fetch events for current profile
  fetchEvents: async (profileId) => {
    if (!profileId) return;
    const { data } = await API.get(`/events/${profileId}`);
    set({ events: data });
  },

  // Create event
  createEvent: async (payload) => {
    await API.post("/events", payload);
    await get().fetchEvents(get().activeProfile);
  },
}));

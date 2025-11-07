import express from "express";
import Profile from "../models/Profile.js";

const router = express.Router();

// Create Profile (like creating user)
router.post("/", async (req, res) => {
  try {
    const profile = new Profile(req.body);
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all profiles
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

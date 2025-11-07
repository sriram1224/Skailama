import express from "express";
import Event from "../models/Event.js";
import Profile from "../models/Profile.js";

const router = express.Router();

// ➤ Create Event
router.post("/", async (req, res) => {
  try {
    const { profiles, timezone, startDate, endDate } = req.body;

    // Find profile IDs by their names
    const profileDocs = await Profile.find({ name: { $in: profiles } });

    const event = await Event.create({
      profiles: profileDocs.map((p) => p._id),
      timezone,
      startDate,
      endDate,
      logs: [{ message: "Event created" }],
    });

    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ Get all events where this profile is a participant
router.get("/:profileId", async (req, res) => {
  try {
    const events = await Event.find({ profiles: req.params.profileId })
      .populate("profiles")
      .sort({ createdAt: -1 });

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ Update event (with logs)
router.put("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("profiles");
    if (!event) return res.status(404).json({ error: "Event not found" });

    const { profiles, timezone, startDate, endDate } = req.body;
    const logs = [];

    if (timezone && timezone !== event.timezone)
      logs.push({ message: `Timezone changed to: ${timezone}` });

    if (
      startDate &&
      new Date(startDate).getTime() !== new Date(event.startDate).getTime()
    )
      logs.push({ message: "Start date/time updated" });

    if (
      endDate &&
      new Date(endDate).getTime() !== new Date(event.endDate).getTime()
    )
      logs.push({ message: "End date/time updated" });

    if (profiles) {
      const oldProfiles = event.profiles.map((p) => p.name).join(", ");
      const newProfiles = profiles.join(", ");
      if (oldProfiles !== newProfiles)
        logs.push({ message: `Profiles changed to: ${newProfiles}` });

      const profileDocs = await Profile.find({ name: { $in: profiles } });
      event.profiles = profileDocs.map((p) => p._id);
    }

    event.timezone = timezone || event.timezone;
    event.startDate = startDate || event.startDate;
    event.endDate = endDate || event.endDate;
    event.logs.push(...logs);

    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ Delete Event
router.delete("/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

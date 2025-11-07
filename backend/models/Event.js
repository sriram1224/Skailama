import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    profiles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profile" }],
    timezone: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    logs: [
      {
        message: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);

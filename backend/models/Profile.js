import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

export default mongoose.model("Profile", profileSchema);

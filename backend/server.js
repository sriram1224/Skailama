import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/Userroutes.js";
import profileRoutes from "./routes/ProfileRoutes.js";
import eventRoutes from "./routes/EventRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/events", eventRoutes);

app.get("/", (req, res) => res.send("Backend working fine ✅"));

app.listen(process.env.PORT || 5000, () =>
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
);

import mongoose from "mongoose";
import { appDb } from "../configs/dbConnection.config.js";

const ActiveDeviceSchema = new mongoose.Schema(
  {
    AuthId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    visitorId: {
      type: String,
      required: true,
    },
    browser: {
      type: String,
      required: true,
    },
    os: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    customId: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamps: true }
);

const ActiveDevice = appDb.model(
  "ActiveDevice",
  ActiveDeviceSchema,
  "activeDevice"
);
export default ActiveDevice;

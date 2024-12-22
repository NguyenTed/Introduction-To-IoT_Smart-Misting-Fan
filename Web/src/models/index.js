import mongoose from "mongoose";

const dhtSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  count: { type: Number, required: true, default: 1 },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

export const DHT = mongoose.model("DHT", dhtSchema);
export const User = mongoose.model("User", userSchema);

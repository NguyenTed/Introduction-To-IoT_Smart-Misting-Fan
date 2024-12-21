import mongoose from "mongoose";

const dhtSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
});

export const DHT = mongoose.model("DHT", dhtSchema);

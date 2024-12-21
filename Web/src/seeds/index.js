import connectDB from "../config/db.js";
import { seedDHT } from "./dht.js";
import dotenv from "dotenv";
dotenv.config();

const seedAll = async () => {
  try {
    await connectDB();
    console.log("Seeding data...");
    await seedDHT();
    console.log("All seeds completed");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding data:", err);
    process.exit(1);
  }
};

seedAll();

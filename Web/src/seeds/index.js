import connectDB from "../config/db.js";
import { seedDHT } from "./dht.js";
import { seedUser } from "./user.js";
import { seedActivity } from "./activity.js";
import dotenv from "dotenv";
dotenv.config();

const seedAll = async () => {
  try {
    await connectDB();
    console.log("Seeding data...");
    await seedDHT();
    await seedUser();
    await seedActivity();
    console.log("All seeds completed");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding data:", err);
    process.exit(1);
  }
};

seedAll();

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI is not defined in the environment variables");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected");
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed due to app termination");
      process.exit(0);
    });
  } catch (err) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;

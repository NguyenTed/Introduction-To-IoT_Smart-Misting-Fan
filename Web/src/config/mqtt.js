import mqtt from "mqtt";
import dotenv from "dotenv";
import { DHT } from "../models/index.js";
dotenv.config();

// MQTT connection
const mqttClient = mqtt.connect(process.env.MQTT_BROKER);

// Variable to track the last saved time
let lastSaveTimestamp = null;

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");

  mqttClient.subscribe("22127142/DHT", (err) => {
    if (err) console.error("Failed to subscribe to DHT topic:", err);
  });
});

mqttClient.on("message", async (topic, message) => {
  const currentTime = new Date();
  const currentMinutes = currentTime.getMinutes();
  const currentSeconds = currentTime.getSeconds();
  const payload = message.toString();

  // Parse the DHT message
  if (topic === "22127142/DHT") {
    const data = payload.split(",");
    const realTimeData = {
      date: currentTime,
      temperature: data[0],
      humidity: data[1],
    };
  }

  // Save data to the database at the top of the hour
  if (currentMinutes === 56 && currentSeconds === 30) {
    if (
      !lastSaveTimestamp ||
      lastSaveTimestamp.getHours() !== currentTime.getHours()
    ) {
      try {
        if (topic === "22127142/DHT") {
          const data = payload.split(",");
          const dht = new DHT({
            date: currentTime,
            temperature: data[0],
            humidity: data[1],
          });
          await dht.save();

          console.log(`DHT data saved at ${currentTime}: ${payload}`);
        }

        lastSaveTimestamp = currentTime;
      } catch (err) {
        console.error("Failed to save data to database:", err);
      }
    }
  } else {
    console.log("Skipping");
  }
});

export { mqttClient };

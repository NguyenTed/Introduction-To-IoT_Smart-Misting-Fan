import mqtt from "mqtt";
import dotenv from "dotenv";
import { DHT, Activity } from "../models/index.js";
import { io } from "../../app.js";
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

  mqttClient.subscribe("22127142/ACTIVITY", (err) => {
    if (err) console.error("Failed to subscribe to DHT topic:", err);
  });
});

mqttClient.on("message", async (topic, message) => {
  const currentTime = new Date();
  const currentMinutes = currentTime.getMinutes();
  const currentSeconds = currentTime.getSeconds();
  const currentMilliseconds = currentTime.getMilliseconds();
  const payload = message.toString();

  // Parse the DHT message
  if (topic === "22127142/DHT") {
    const data = payload.split(",");
    const realTimeData = {
      date: currentTime,
      temperature: Math.round(Number(data[0]) * 100 + Number.EPSILON) / 100,
      humidity: Math.round(Number(data[1]) * 100 + Number.EPSILON) / 100,
    };
    io.emit("dht_data", realTimeData);
  } else if (topic === "22127142/ACTIVITY") {
    const newActivity = Activity({
      date: currentTime,
      activity: payload,
    });
    await newActivity.save();
    console.log(newActivity);
    console.log(newActivity.date);
    io.emit("activity", { date: currentTime, activity: payload });
  }

  // Save data to the database at the top of the hour
  if (
    currentMinutes === 45 &&
    currentSeconds === 15 &&
    currentMilliseconds < 300
  ) {
    if (
      !lastSaveTimestamp ||
      lastSaveTimestamp.getHours() !== currentTime.getHours()
    ) {
      try {
        if (topic === "22127142/DHT") {
          const data = payload.split(",");
          const startTime = new Date(currentTime);
          const endTime = new Date(currentTime);
          startTime.setHours(0, 0, 0, 0);
          endTime.setHours(23, 59, 59, 999);
          console.log(startTime);
          console.log(endTime);
          const dht = await DHT.findOne({
            date: { $gte: startTime, $lte: endTime },
          });
          if (dht) {
            console.log("Data already exists");
            const count = dht.count + 1;
            dht.temperature = Math.ceil(
              (dht.temperature * dht.count + Number(data[0])) / count
            );
            dht.humidity = Math.ceil(
              (dht.humidity * dht.count + Number(data[1])) / count
            );
            dht.count = count;
            console.log(dht.count);
            await dht.save();
          } else {
            console.log("Data yet exists");
            const newDHT = new DHT({
              date: currentTime,
              temperature: data[0],
              humidity: data[1],
              count: 1,
            });
            await newDHT.save();
          }

          console.log(`DHT data saved at ${currentTime}: ${payload}`);
        }

        lastSaveTimestamp = currentTime;
      } catch (err) {
        console.error("Failed to save data to database:", err);
      }
    }
  }
});

export { mqttClient };

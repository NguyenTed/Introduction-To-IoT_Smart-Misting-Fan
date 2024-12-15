import mqtt from "mqtt";
import dotenv from "dotenv";
dotenv.config();

const mqttClient = mqtt.connect(process.env.MQTT_BROKER);

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");

  // Subscribe to the temperature topic
  mqttClient.subscribe(process.env.TOPIC, (err) => {
    if (err) {
      console.error("Failed to subscribe to topic: ", err);
    }
  });
  // Subscribe to the another topic
});

mqttClient.on("message", async (topic, message) => {
  if (topic === process.env.TOPIC) {
    const get_payload_str = message.toString();
    console.log(`${topic} : payload string received : ${get_payload_str}\n`);
  }
});

export default mqttClient;

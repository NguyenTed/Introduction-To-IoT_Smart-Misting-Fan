import { DHT } from "../models/index.js";
import { getRandomDate } from "../utils/common.js";

export const seedDHT = async () => {
  await DHT.deleteMany({});

  for (let i = 0; i < 10; i++) {
    const dht = new DHT({
      date: getRandomDate(
        new Date("2024-12-18T00:00:00Z"),
        new Date("2024-12-21T00:00:00Z")
      ),
      temperature: Math.floor(Math.random() * 100),
      humidity: Math.floor(Math.random() * 100),
    });
    await dht.save();
  }
};

import { DHT } from "../models/index.js";
import { getRandomNumberInRange } from "../utils/common.js";

export const seedDHT = async () => {
  await DHT.deleteMany({});

  const currentDate = new Date();

  for (let i = 0; i < 10; i++) {
    const dht = new DHT({
      date: new Date(currentDate.getTime() - (i + 1) * 24 * 60 * 60 * 1000), // Decrease by i days
      temperature: getRandomNumberInRange(28, 32),
      humidity: getRandomNumberInRange(35, 64),
      count: 1,
    });
    await dht.save();
  }
};

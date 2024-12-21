import { DHT } from "../models/index.js";

function getRandomDate(start, end) {
  const startTime = start.getTime();
  const endTime = end.getTime();

  if (startTime > endTime) {
    throw new Error("Start date must be before or equal to the end date.");
  }

  const randomTime = Math.random() * (endTime - startTime) + startTime;
  return new Date(randomTime).toISOString();
}

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

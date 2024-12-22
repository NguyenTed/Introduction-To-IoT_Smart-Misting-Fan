import { Activity } from "../models/index.js";
import { getRandomDate } from "../utils/common.js";

export const seedActivity = async () => {
  await Activity.deleteMany({});

  for (let i = 0; i < 10; i++) {
    const activity = new Activity({
      date: getRandomDate(
        new Date("2024-12-18T00:00:00Z"),
        new Date("2024-12-21T00:00:00Z")
      ),
      activity: "Misting fan turned on",
    });
    await activity.save();
  }
};

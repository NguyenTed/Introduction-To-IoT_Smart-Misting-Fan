import { User } from "../models/index.js";

export const seedUser = async () => {
  await User.deleteMany({});

  for (let i = 0; i < 10; i++) {
    const user = new User({
      name: `User ${i + 1}`,
      email: `email${i + 1}@example.com`,
      username: `user${i + 1}`,
      password: "123",
    });
    await user.save();
  }
};

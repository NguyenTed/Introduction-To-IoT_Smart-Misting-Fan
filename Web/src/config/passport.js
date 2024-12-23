import passport from "passport";
import LocalStrategy from "passport-local";
import bcrypt from "bcrypt";
import { User } from "../models/index.js";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    console.log("Authenticating:", username);
    const user = await User.findOne({ username });
    console.log("User:", user);
    if (!user) return done(null, false, { message: "No user found" });
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password Match:", isMatch);
    return done(null, isMatch ? user : false, { message: "Wrong password" });
  })
);

// Serialize user to session
passport.serializeUser((user, done) => {
  console.log("Serializing user:", user);
  done(null, user.id); // Save user ID to the session
});

passport.deserializeUser(async (id, done) => {
  console.log("Deserializing user with ID:", id);
  try {
    const user = await User.findById(id);
    console.log("Deserialized user:", user);
    done(null, user);
  } catch (err) {
    console.error("Deserialization Error:", err);
    done(err);
  }
});

import { Router } from "express";
import bcrypt from "bcrypt";
import passport from "passport";
import { User } from "../models/index.js";

const router = Router();

// Login Page
router.get("/login", (req, res) => {
  const error_msg = req.flash("error_msg"); // Retrieve the flash error
  console.log("Retrieved flash message:", error_msg); // Check the message
  res.render("login", { error_msg: error_msg[0] || "" }); // Pass to template
});

// signup Page
router.get("/signup", (req, res) => {
  console.log("Signup page requested");
  res.render("signup", {
    errors: [],
    name: "",
    email: "",
    username: "",
    password: "",
  });
});

// signup Handle
router.post("/signup", async (req, res) => {
  const { name, email, username, password } = req.body;
  let errors = [];

  if (password.length < 6)
    errors.push({ msg: "Password must be at least 6 characters" });

  if (errors.length > 0) {
    res.render("signup", { errors, name, email, username, password });
  } else {
    const user = await User.findOne({ username });
    if (user) {
      errors.push({ msg: "User already exists" });
      res.render("signup", { errors, name, email, username, password });
    } else {
      const newUser = new User({
        name,
        email,
        username,
        password: await bcrypt.hash(password, 10),
      });
      await newUser.save();
      req.flash("success_msg", "You are now registered and can log in");
      res.redirect("/users/login");
    }
  }
});

// Login Handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Authentication Error:", err);
      return next(err);
    }
    if (!user) {
      console.warn("Authentication Failed:", info.message); // Log the info message
      req.flash("error_msg", info.message); // Add message to flash
      console.log("Flash message set:", req.flash("error_msg")); // Check flash is being set
      return res.redirect("/users/login");
    }
    req.login(user, (err) => {
      if (err) {
        console.error("Login Error:", err);
        return next(err);
      }
      return res.redirect("/");
    });
  })(req, res, next);
});

// Logout Handle
router.get("/logout", (req, res) => {
  req.logout(() => {
    req.flash("success_msg", "You are logged out");
    res.redirect("/users/login");
  });
});

export default router;

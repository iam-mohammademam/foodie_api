import passport from "passport";
import { Router } from "express";
import "../config/passport.js";
const google = Router();

// Route to initiate Google login
google.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback route for Google OAuth
google.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);
export default google;

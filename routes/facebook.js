import passport from "passport";
import { Router } from "express";
const facebook = Router();

// Facebook Login
facebook.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

// Facebook Callback
facebook.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);
export default facebook;

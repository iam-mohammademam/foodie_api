import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {
  googleCallbackUrl,
  googleClientId,
  googleClientSecret,
} from "../middlewares/variables.js";
// console.log(googleClientId, googleCallbackUrl, googleClientSecret);
// import { Strategy as FacebookStrategy } from "passport-facebook";
passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: googleCallbackUrl,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Replace with DB logic to find or create a user
        const user = {
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0]?.value,
        };
        console.log(user);
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_APP_ID,
//       clientSecret: process.env.FACEBOOK_APP_SECRET,
//       callbackURL: "/api/auth/facebook/callback",
//       profileFields: ["id", "displayName", "photos", "email"],
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const user = {
//           id: profile.id,
//           displayName: profile.displayName,
//           email: profile.emails[0]?.value,
//         };
//         return done(null, user);
//       } catch (err) {
//         return done(err, null);
//       }
//     }
//   )
// );
// Serialize user into the session
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

import express from "express";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

// Load the .env file from the backend folder
dotenv.config({
  path: fileURLToPath(new URL("./.env", import.meta.url))
});

const app = express();

// EJS configuration
app.set("view engine", "ejs");
app.set("views", "./views");

// Common layout configuration
app.use(expressLayouts);
app.set("layout", "layouts/main");

// Static files
app.use(express.static("public"));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    }
  })
);

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    (accessToken, refreshToken, profile, done) => {
      const user = {
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails?.[0]?.value,
        photo: profile.photos?.[0]?.value
      };

      // Prototype only: persist users in MongoDB before production use.
      done(null, user);
    }
  )
);

// Store the authenticated user in the session
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Google login route
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

// Google callback route
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login"
  }),
  (req, res) => {
    res.redirect("/");
  }
);

// Login page
app.get("/login", (req, res) => {
  res.render("pages/login", {
    title: "BehindTheWin | Login"
  });
});

// Logout route
app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((sessionErr) => {
      if (sessionErr) return next(sessionErr);
      res.redirect("/login");
    });
  });
});

// Home route (preserved from your original code)
app.get("/", (req, res) => {
  res.render("pages/home", {
    title: "BehindTheWin | Home"
  });
});

/*
app.get("/stories", (req, res) => {
  res.render("stories", {
    title: "BehindTheWin | Stories"
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "BehindTheWin | About"
  });
});
*/

export default app;
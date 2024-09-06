const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const prisma = require("../config/prisma");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GA_CLIENT_ID,
      clientSecret: process.env.GA_CLIENT_SECRET_KEY,
      callbackURL: `http://localhost:${process.env.PORT}/api/v1/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await prisma.user.upsert({
          where: {
            email: profile.emails[0].value,
          },
          update: {
            googleId: profile.id,
            username: profile.name.givenName,
          },
          create: {
            email: profile.emails[0].value,
            googleId: profile.id,
            username: profile.name.givenName,
          },
        });
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

module.exports = passport;

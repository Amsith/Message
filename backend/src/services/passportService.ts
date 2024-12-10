import userModel from "../models/registerModel";
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import passport from 'passport'
import configs from "../configs/config";


passport.serializeUser((user: any) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userModel.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: configs.googleClientID,
      clientSecret: configs.googleClientSecret,
      callbackURL: '/auth/google/callback',  // Callback URL to handle the response
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: (err: any, user?: any) => void) => {
      try {

        console.log(profile)
        // Check if the user already exists in the database by googleId
        const existingUser = await userModel.findOne({ googleId: profile.id });
        if (existingUser) {
          // If the user already exists, pass them to done callback
          return done(null, existingUser);
        }

        // If the user doesn't exist, create a new user
        const newUser = new userModel({
          googleId: profile.id,
          username: profile.displayName,  // Assuming this field exists
          email: profile.emails?.[0]?.value,
          isVerified: 'true',
        });

        // Save the new user to the database
        await newUser.save();
        return done(null, newUser);  // Pass the newly created user to done callback
      } catch (err) {
        // Handle errors such as database issues
        return done(err, null);
      }
    }
  )
);









export default passport;

function done(arg0: null, id: any) {
  throw new Error("Function not implemented.");
}

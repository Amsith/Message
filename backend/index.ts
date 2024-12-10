import express from 'express';
import cors from 'cors';
import configs from './src/configs/config';
import route from './src/router/route';
import cookieParser from 'cookie-parser';
import helmet from "helmet";
import passport from 'passport';
import session from 'express-session';
import connectDatabase from './src/database/db'
import userModel from './src/models/registerModel';

//
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';


const app = express();

// Middlewares
app.use(express.json());

// Configure CORS to allow credentials (cookies)
const corsOptions = {
  // allowing front to make the request to the backend
  origin: 'http://localhost:3000',
  credentials: true, // Allow credentials (cookies) to be sent
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(helmet());


// Connect to the database
connectDatabase()


// Session Middleware (Needed for Passport)
app.use(
  session({
    secret: configs.cookieKey,
    resave: false,  // Don't resave the session if not modified
    saveUninitialized: false, // Don't save unmodified (empty) sessions
    cookie: { 
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true, 
      secure: false, // Change to `true` if using HTTPS
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());






passport.use(
  new GoogleStrategy(
    {
      clientID: configs.googleClientID,
      clientSecret: configs.googleClientSecret,
      callbackURL: '/auth/google/callback', // Callback URL to handle the response
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: (err: any, user?: any) => void) => {
      try {

        // Check if the user already exists in the database by googleId
        const existingUser = await userModel.findOne({ googleId: profile.id });
        if (existingUser) {
          // If the user already exists, pass them to done callback
          return done(null, existingUser);
        }

        // If the user doesn't exist, create a new user
        const newUser = new userModel({
          googleId: profile.id,
          username: profile.displayName, // Assuming this field exists
          email: profile.emails?.[0]?.value,
          isVerified:true,
        });

        // Save the new user to the database
        await newUser.save();
        done(null, newUser); // Pass the newly created user to done callback
      } catch (err) {
        // Handle errors such as database issues
        done(err, null);
      }
    }
  )
);


// ==  saving into session using id only
passport.serializeUser((user: any, done) => {
  done(null, user._id); // Use `_id` if `id` doesn't exist
  console.log("Serialize User by id:",user._id)
});

// == get the user deatils using the id
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id); // Ensure this uses `_id`
    console.log('Deserialized user:', user);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});




app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account' // Forces Google to show the account selection screen
}));

// after google login it wil redirect to this
app.get('/auth/google/callback', passport.authenticate('google'),
  (req, res) => {
    res.redirect('http://localhost:3000/home')
  }
);


//== Logout function
// app.post('/logout', (req, res) => {
//   req.logout((err) => {
//     if (err) {
//       console.error("Error during logout:", err);
//       res.status(500).json({ success: false, message: "Logout failed" });
//     } else {
//       res.clearCookie('token'); // Clear any authentication cookies if used
//       res.status(200).json({ success: true, message: "Successfully logged out" });
//     }
//   });
// });

app.get('/current_user', (req, res) => {
  res.send(req.user);
  console.log(req.user)
});




















// Setup routes
app.use('/api', route({}));

// Start server
app.listen(configs.PORT, () => {
  console.log(`Server is running on ${configs.PORT}`);
});






import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieSession from 'cookie-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import Artistrouter from './routes/ArtistRoute.js';
import PostRoute from './routes/PostRoute.js';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import flash from 'express-flash';
import Artist from './models/Artist.js';


const app=express();
const hostname='127.0.0.1';
const port=process.env.PORT || 9090;
const DataBaseName='MiniProjeta';

mongoose.set("debug", true);
mongoose.Promise=global.Promise;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use("/image", express.static("public/images")); 

app.use(
  cookieSession({
    name: "session",
    secret: "COOKIE_SECRET",
    httpOnly: true
  })
);

app.use(flash());

passport.use(
  new GoogleStrategy(
    {
      callbackURL: process.env.CALLBACK_URL,
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      const firstName = profile.name.givenName;
      const lastName = profile.name.familyName;
      const fullName=firstName+""+lastName;

      const currentUser = await Artist.findOne({ email });

      if(!currentUser){
        const newUser = await addGoogleUser({
          email,
          fullName
        })
        return done(null, newUser);
      }


    }
  )
);

app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    successRedirect: "/profile",
    failureFlash: true,
    successFlash: "Successfully logged in!",
  })
);

mongoose
  .connect(`mongodb://localhost:27017/${DataBaseName}`)
  .then(() => {
    console.log(`connected to ${DataBaseName}`);
  })
  .catch((err) => {
    console.log(err);
  });

app.use('/MiniProjet',Artistrouter);
app.use(PostRoute);

  app.listen(port,hostname,()=>{
    console.log(`Server running at http://${hostname}:${port}/`);
});

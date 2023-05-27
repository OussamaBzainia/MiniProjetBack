import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieSession from 'cookie-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import http from 'http';
import Artistrouter from './routes/ArtistRoute.js';
import PostRoute from './routes/PostRoute.js';
import ChatRoute from './routes/ChatRoute.js';
import NotificationRoute from './routes/NotificationRoute.js';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import flash from 'express-flash';
import Artist from './models/Artist.js';
import handleSocketConnection from './controllers/SocketController.js';


const app=express();


const port=process.env.PORT || 9090;
const DataBaseName='MiniProjeta';

mongoose.set("debug", true);
mongoose.Promise=global.Promise;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use("/media", express.static("media"));

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
  .connect(process.env.MONGODB_URI)
  //mongodb://mongo/[]]Dqtq bsenq;le
  .then(() => {
    console.log(`connected to ${DataBaseName}`);
  })
  .catch((err) => {
    console.log(err);
  });

  //routes
app.use('/MiniProjet',Artistrouter);
app.use(PostRoute);
app.use(ChatRoute);
app.use(NotificationRoute);



//socket connection
const server = http.createServer(app);
const io = new Server(server);
handleSocketConnection(io);

server.listen(port,hostname,()=>{
    console.log(`Server running on ${port}`);
});



import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieSession from 'cookie-session';

import Artistrouter from './routes/ArtistRoute.js';


const app=express();
const hostname='127.0.0.1';
const port=process.env.PORT || 9090;
const DataBaseName='MiniProjeta';

mongoose.set("debug", true);
mongoose.Promise=global.Promise;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use("/image", express.static("public/images")); 

app.use(
  cookieSession({
    name: "session",
    secret: "COOKIE_SECRET",
    httpOnly: true
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

  app.listen(port,hostname,()=>{
    console.log(`Server running at http://${hostname}:${port}/`);
});

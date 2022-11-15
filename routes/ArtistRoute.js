import express from 'express';
import { getAllArtists,AddArtist,getOneArtist,deleteOneArtist,registerArtist, login, signOut, resetLink, resetPassword } from '../controllers/ArtistController.js';
import { check, validationResult } from "express-validator";
import auth from "../middlewares/auth.js";
import multer from "../middlewares/multer-config.js";

const router=express.Router();

router
      .route('/')
      .get(getAllArtists)
      .post(
            multer,
            check("email")
            .isEmail()
            .withMessage("invalid email address")
            .normalizeEmail(),
             AddArtist
            );


router 
      .route('/:nom')
      .get(getOneArtist)

router
      .route('/:email')
      .delete(deleteOneArtist);

router
      .route('/register')
      .post(registerArtist);

router
      .route('/login')
      .post(login)

router
      .route("/singOut")
      .post(signOut);

router.post("/welcome", auth, (req, res) => {
            res.status(200).send("Welcome");
          });

router.route("/getlink")
      .post(resetLink)

router.route("/:userId/:token")
      .post(resetPassword)
export default router;
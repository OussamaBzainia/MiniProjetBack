import express from 'express';
import { getAllArtists,AddArtist,getOneArtist,deleteOneArtist,registerArtist, login,loginGoogle,getAllPosts, signOut, sendpasswordEmail, resetPassword,verifyEmail,UpdateArtistById,followArtist,unfollowArtist } from '../controllers/ArtistController.js';
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
      .route('/:id')
      .get(getOneArtist)

router
      .route('/:email')
      .delete(deleteOneArtist);

router
      .route('/register')
      .post(registerArtist);

router 
      .route('/verify')
      .post(verifyEmail)

router
      .route('/login')
      .post(login)

router
      .route('/loginGoogle')
      .post(loginGoogle)

router
      .route("/logOut")
      .post(signOut);

router.post("/welcome", auth, (req, res) => {
            res.status(200).send("Welcome");
          });

router.route("/getOTP")
          .post(sendpasswordEmail)

router.route("/resetPassword")
          .post(resetPassword)
    
router.route("/:token/:userId")
          .post(resetPassword)

router.route("/update/:id")
      .put(UpdateArtistById);

router.route("/follow/:id")
      .put(followArtist);

router.route("/unfollow/:id")
      .put(unfollowArtist);

router.route("/getAllPosts/:id")
      .get(getAllPosts);

      
export default router;
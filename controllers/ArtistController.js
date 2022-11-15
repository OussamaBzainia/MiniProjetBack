import Artist from "../models/Artist.js";
import tokenReset from "../models/ResetToken.js";
import bcrypt from 'bcryptjs';
import sendEmail from "../middlewares/sendEmail.js";
import jwt from 'jsonwebtoken';
import crypto from "crypto";
import  Joi from "Joi"
import dotenv  from 'dotenv';

dotenv.config();


//get all artists
export function getAllArtists(req,res){
    Artist
    .find({})
    .then(artists=>{
        res.status(200).json(artists)
    })
    .catch(err=>{
        res.status(500).json({error:err});
    });
}


//add one artist

export function AddArtist(req,res)
{
    Artist.create({
        idArtist:req.body.idArtist,
        email:req.body.email,
        mdp:req.body.mdp,
        confirmMdp:req.body.confirmMdp,
        nom:req.body.nom,
        prenom:req.body.prenom,
        ProfilePic:`${req.protocol}://${req.get('host')}/img/${req.file.filename}`
    })
    .then(newArtist=>{
        res.status(200).json(newArtist);
    })
    .catch(err=>{
        res.status(500).json({error:err});
    });

}

//Add many artists

//get one
export function getOneArtist(req,res){
    Artist
    .findOne({"nom":req.params.nom})
    .then(doc =>{
        res.status(200).json(doc);
    })
    .catch(err=>{
        res.status(500).json({error:err});
    });
}

//Delete one artist

export function deleteOneArtist(req,res){
    Artist
    .findOneAndRemove({"email":req.params.email})
    .then(doc=>{
     res.status(200).json(doc);
     console.log('User deleted with success');
    })
    .catch(err=>{
     res.status(500).json({error:err});
    });
}


//register 

export async function registerArtist (req,res){

    try {
    // Get Artist input
    const {email,mdp,nom,prenom}=req.body;

    // Validate Artist input
    if (!(email && mdp && prenom && nom)) {
        res.status(400).send("All input is required");
      }

    // check if Artist already exist
    // Validate if Artist exist in our database
    const oldArtist = await Artist.findOne({ email });

        if (oldArtist) {
        return res.status(409).send("Artist Already Exist. Please Login");
        }

    //Encrypt password
    const encryptedmdp = await bcrypt.hash(mdp, 10);

    // Create Artist in our database
    const NewArtist = await Artist.create({
        email: email.toLowerCase(), 
        mdp: encryptedmdp,
        nom,
        prenom

      });

    // Create token
    const token = jwt.sign(
        { user_id: Artist._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

    // save user token
    Artist.token = token;

    // return new user
    res.status(201).json(NewArtist);

}

catch(err){
    console.log(err);
}

}


//Login artist

export async function login(req,res){

    try{
        const { email, mdp } = req.body;

        if (!(email && mdp)) {
            res.status(400).send("All input is required");
          }
    
        const artist = await Artist.findOne({ email });

        if (artist && (await bcrypt.compare(mdp, artist.mdp))) {
            // Create token
            const token = jwt.sign(
              { user_id: Artist._id, email },
              process.env.TOKEN_KEY,
              {
                expiresIn: "2h",
              }
            );      
       
            // save user token
            artist.token = token;

            req.session.token = token;
            // artist
            res.status(200).json(artist);
          }
          res.status(400).send("Invalid Credentials");

    }

    catch(err){
        console.log(err);
    }
}


//sign out 

export async function signOut(req,res,next){
    try{
        req.session=null;
        return res.status(200).send({message : "You've been signed out!"})
    }

    catch(err){
        this.next(err);
    }
}

export async function resetLink(req,res){

    try {
        const schema = Joi.object({ email: Joi.string().email().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await Artist.findOne({ email: req.body.email });
        if (!user)
            return res.status(400).send("user with given email doesn't exist");

        let resetToken = await tokenReset.findOne({ userId: user._id });
        if (!resetToken) {
            resetToken = await new tokenReset({
                userId: user._id,
                tokenReset: crypto.randomBytes(32).toString("hex"),
            }).save();
        }

        const link = `${process.env.BASE_URL}/password-reset/${user._id}/${resetToken.tokenReset}`;
        await sendEmail(user.email, "Password reset", link);

        res.send("password reset link sent to your email account");
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }

}

export async function resetPassword(req,res){

    try {
        const schema = Joi.object({ mdp: Joi.string().required(),confirmMdp: Joi.string().required()  });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await Artist.findById(req.params.userId);
        if (!user) return res.status(400).send("invalid link or expired");

        const token = await tokenReset.findOne({
            userId: user._id,
            tokenReset: req.params.token,
        });
        if (!token) return res.status(400).send("Invalid link or expired");

        user.mdp = req.body.mdp;
        user.confirmMdp = req.body.confirmMdp;
        await user.save();
        await token.delete();

        res.send("password reset sucessfully.");
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
}
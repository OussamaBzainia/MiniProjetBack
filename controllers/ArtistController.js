import Artist from "../models/Artist.js";
import tokenReset from "../models/token.js"
import sendEmail from "../middlewares/sendEmail.js";
import generateOTP from "../middlewares/otpGenerator.js";
import sendMailOTP from "../middlewares/OTPmail.js";
import bcrypt from 'bcryptjs';
import nodemailer from "nodemailer";
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
        FullName:req.body.FullName,
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
    const id= req.params.id
    Artist
    .findById(id,'username PhoneNumber Gender BirthDate Description')
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

//Update artist by id

export async function UpdateArtistById(req,res)
{
    const id= req.params.id

    Artist.findByIdAndUpdate(id,{
        $set:{
            username:req.body.username,
            PhoneNumber:req.body.PhoneNumber,
            Gender:req.body.Gender,
            BirthDate:req.body.BirthDate,
            Description:req.body.Description

        }
    })
    .then(docs=>{
        res.status(200).json(docs);
    })
    .catch(err=>{
        res.status(500).json({error:err});
    });
        
}


//register 

export async function registerArtist (req,res){

 
    // Get Artist input
    const {email,mdp,FullName,confirmMdp,verified,otp,PhoneNumber,Gender,BirthDate,Description}=req.body;

    // Validate Artist input
    if (!(email)) {
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

    //generate otp
    const otpGenerated = generateOTP();

    // Create Artist in our database
    const NewArtist = new Artist ({
        email: email.toLowerCase(), 
        mdp: encryptedmdp,
        FullName,
        verified:false,
        otp: otpGenerated,
        PhoneNumber,
        Gender,
        BirthDate,
        Description,
        posts:[]

      })
    
      
        const token =  jwt.sign(
            { user_id: Artist._id, email },
            process.env.TOKEN_KEY,
            {
              expiresIn: "2h",
            }
          );
    
        // save user token
         NewArtist.token = token;
         Artist.create(NewArtist)
         .then(docs=>{
            res.status(200).json(NewArtist);
            sendMailOTP(email,otpGenerated);
        })
        .catch(err=>{
            res.status(500).json({error:err});
        });
        
         
          
          
    
          // return new user
    

}



export async function verifyEmail(req,res){
    const {email,otp} = req.body;
    const user =  validateUserSignUp(email, otp);
    res.status(200).json(user);
}

export async function validateUserSignUp(email, otp){
    const user = await Artist.findOne({
        email,
      });
      if (!user) {
        return [false, 'User not found'];
      }
      if (user && user.otp !== otp) {
        return [false, 'Invalid OTP'];
      }

      const updatedUser = await Artist.findByIdAndUpdate(user._id, {verified: true });
      console.log(updatedUser);
}



//Login artist

export async function login(req,res){

    try{
        const { email, mdp } = req.body;

        if (!(email && mdp)) {
            res.status(400).send("All input is required");
          }
    
        const artist = await Artist.findOne({ email });

        if (artist && (bcrypt.compare(mdp, artist.mdp))) {
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
        else{
            res.status(400).send("invalid Information")       }

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




// //forgot password
// export async function forgotPassword(req,res,next){
//     const { email } = req.body;

//     const user=Artist.findOne({email});

//     if(!user){
//         return next (new ErrorResponse('There is no user with that email',404))
//     }

//     const resetToken= crypto.randomBytes(20).toString('hex');

//     Artist.resetPasswordToken = crypto
//         .createHash('sha256')
//         .update(resetToken)
//         .digest('hex');

//     Artist.resetPasswordExpire=Date.now() + 10 *60 *1000;

//     const resetUrl = `${req.protocol}://${process.env.BASE_URL}/resetPassword/${resetToken}`;

//     await sendEmail(email, "Password reset token", resetUrl);

//     res.status(200).json(resetUrl);

// }

// //Reset passowrd

// export async function resetPassword(req,res,next){

//     const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

//     const user=Artist.findOne({
//         resetPasswordToken,
//         resetPasswordExpire:{$gt: Date.now()}
//     })

//     if(!user){
//         return next(new ErrorResponse('Invalid Token ',400));
//     }

//     user.mdp=req.body.mdp;
//     user.confirmMdp = req.body.confirmMdp;
//     user.resetPasswordToken=undefined;
//     user.resetPasswordExpire=undefined;
//     user.save();

//     res.send("password reset sucessfully.");
// }


// //Send reset password link

export async function resetOTP(req,res){

const user = Artist.findOne({ email: req.body.email });

  if (!user) throw new Error("User does not exist");

  //generate otp
  const otpGenerated = await generateOTP();

 //update database
user.resetOTP = otpGenerated
 Artist.findOneAndUpdate({"email":req.body.email},{
        otpReset:otpGenerated

        
})
.then(docs=>{

     // send mail
    sendEmail(user.email, "Password Reset",otpGenerated);
    user.resetOTP = otpGenerated
    res.status(200).json(user);

})
.catch(err=>{
    res.status(500).json({error:err});
});
 

}


// export async function  resetPassword(req, res)
// {
//     const user = await Artist.findOne({ email: req.body.email });
   
   
//     if (user.otpReset !== req.body.otpReset) {
//       throw new Error("Invalid or expired password reset OTP");
//     }

//     else{
//     const password=req.body.mdp
//     const encryptedmdp = await bcrypt.hash(password, 10);
//     await Artist.updateOne(user.email ,{ $set: { mdp: encryptedmdp } } );
//     sendEmail(user.email, "Password Reset","Password reset Successfull");
//     res.send("Password reset successfull ");
   
//     }

//   };



  export async function sendpasswordEmail(req, res) {
  
    let user = await Artist.findOne({ email: req.body.email });
    if (user) {
      
      const OTP = Math.floor(1000 + Math.random() * 9000).toString();
       Artist.findOneAndUpdate({ "_id": user._id }, {
        otpReset:OTP
            }).then(async docs => {
    sendEmail(user.email, "Password Reset",OTP);
        user.otpReset = OTP;
        res.status(200).json(user);
        console.log(user);
      })
        .catch(err => {
          res.status(500).json({ error: err });
        });
      
    }

  
}

export async function resetPassword(req, res) {
  
    const user = await Artist.findOne({ email: req.body.email });

    if (user){ 
      if (req.body.otpReset === user.otpReset) {
        const EncryptedPassword = await bcrypt.hash(req.body.mdp, 10);
        await Artist.findOneAndUpdate({ _id: user._id }, {
          mdp: EncryptedPassword
        }).then(docs => {
         
          res.status(200).json(docs)
          
        })
          .catch(err => {
            res.status(500).json("Cant reset password");
          });
      }
    }
 // }

}










/*
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
            resetToken =tokenReset.create({
                userId: user._id,
                tokenReset: "test"
            });
        }

        const link = `${process.env.BASE_URL}/password-reset/${user._id}/${resetToken.tokenReset}`;
        await sendEmail(user.email, "Password reset", link);

        res.send("password reset link sent to your email account");
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }

}*/

// res.send("password reset link sent to your email account");
import Post from "../models/Post.js"
import jwt from 'jsonwebtoken';
import Artist from "../models/Artist.js";
import mongoose from "mongoose";


// export async function VerifyTokenPost(req, res, next){

//     const token= req.body.token || req.query.token || req.headers["x-access-token"];

//     if (!token) {
//         return res.status(403).send("A token is required to add a post");
//       }

//     try {
//         const decoded = jwt.verify(token, process.env.TOKEN_KEY);
//         req.artist = artist;
//         } 
//       catch (err) {
//         return res.status(401).send("Invalid Token");
//       }

//       return next();
// }


// create post
export async function addPost(req,res){
    const {title,description,userId}=req.body;
    let existingUser;
    try{
        existingUser=await Artist.findById(userId)

    }
    catch(err){
        return console.log(err);
    }
    if(!existingUser){
        return res.status(400).json({message:"Unable to find the user"});
    }
    Post.create({
        title:req.body.title,
        description:req.body.description,
        //image:`${req.protocol}://${req.get('host')}/img/${req.file.filename}`,
        userId:req.body.userId
        
    })
    .then(newPost=>{
        existingUser.posts.push(newPost);
        existingUser.save();
        res.status(200).json(newPost);
    })
    .catch(err=>{
        res.status(500).json({error:err});
    });
}

//update post
export async function UpdatePostById(req,res)
{
    const id= req.params.id

    Post.findByIdAndUpdate(id,{ title:req.body.title,description:req.body.description})
    .then(docs=>{
        res.status(200).json(docs);
    })
    .catch(err=>{
        res.status(500).json({error:err});
    });
        
}

//get post by Id
export async function getPost(req,res){
    const id= req.params.id
    Post
    .findById(id)
    .then(doc =>{
        res.status(200).json(doc);
    })
    .catch(err=>{
        res.status(500).json({error:err});
    });
}

//delete post

export function deleteOnePost(req,res){
    const id= req.params.id
    Post
    .findByIdAndDelete(id)
    .then(doc=>{
     res.status(200).json(doc);
     console.log('Post deleted with success');
    })
    .catch(err=>{
     res.status(500).json({error:err});
    });
}
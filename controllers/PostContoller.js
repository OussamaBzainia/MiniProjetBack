import Post from "../models/Post.js"
import jwt from 'jsonwebtoken';
import Artist from "../models/Artist.js";
import Notification from "../models/Notification.js";
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
export async function addPost(req, res) {
    const { userId } = req.body;
    let existingUser;
    try {
      existingUser = await Artist.findById(userId);
      if (!existingUser) {
        return res.status(400).json({ message: "Unable to find the user" });
      }
      const newPost = await Post.create({
        description: req.body.description,
        image: `${req.protocol}://${req.get("host")}${process.env.IMGURL}/${req.file.filename}`,
        userId: userId,
      });
      existingUser.posts.push(newPost);
      await existingUser.save(); // Wait for the user to be saved before responding
      res.status(200).json(newPost);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Unable to create post" });
    }
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

//get all posts by id 
export async function getAllPostsById(req,res){
  res.send({
    posts: await Post.find({userId: req.params.id})
        .populate("userId")
})
}


//get all posts
export async function getAll(req, res) {
  res.send({posts: await Post.find().populate("userId")})
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

//Like a post

export async function LikePost(req, res) {
    try {
      const post = await Post.findById(req.params.id);
      if (!post.likes.includes(req.body.userId)) {
        await post.updateOne({ $push: { likes: req.body.userId } });
        await post.updateOne({ $set: { isLiked: true } });
        
        // Create a new notification
      const notification = new Notification({
        userId: post.userId,
        message: 'Liked your post',
        likedBy:req.body.userId,
        createdAt: new Date()
      });

      await notification.save();
        res.status(200).json("The post has been liked");
      } else {
        await post.updateOne({ $pull: { likes: req.body.userId } });
        await post.updateOne({ $set: { isLiked: false } }); 
        res.status(200).json("The post has been disliked");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  };
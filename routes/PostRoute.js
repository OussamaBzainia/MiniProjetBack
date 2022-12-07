import express from 'express';
import multer from "../middlewares/multer-config.js";
import { addPost,getPost,deleteOnePost,UpdatePostById,getAllPosts,LikePost } from '../controllers/PostContoller.js';


const router=express.Router();


router
      .route('/addPost')
      .post(multer,addPost);

router
      .route('/getPost/:id')
      .get(getPost);

router
      .route('/getAllPosts/:id')
      .get(getAllPosts);

router
      .route('/updatePost/:id')
      .put(UpdatePostById);

router
      .route('/deletePost/:id')
      .delete(deleteOnePost);

router
      .route('/likePost/:id')
      .put(LikePost);



export default router
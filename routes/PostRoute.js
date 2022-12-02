import express from 'express';
import multer from "../middlewares/multer-config.js";
import { addPost,getPost,deleteOnePost,UpdatePostById } from '../controllers/PostContoller.js';


const router=express.Router();


router
      .route('/addPost')
      .post(multer,addPost);

router
      .route('/getPost/:id')
      .get(getPost);

router
      .route('/updatePost/:id')
      .put(UpdatePostById);

router
      .route('/deletePost/:id')
      .delete(deleteOnePost);



export default router
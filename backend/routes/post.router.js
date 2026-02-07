import express from 'express';
const postRouter = express.Router();
import isAuth from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';
import { comment, createPost, getPost, like } from '../controllers/post.controller.js';

postRouter.post("/create", isAuth, upload.single("image"), createPost)
postRouter.get("/getPost", isAuth, getPost)
postRouter.get("/like/:id", isAuth, like);
postRouter.post("/comment/:id", isAuth, comment);


export default postRouter
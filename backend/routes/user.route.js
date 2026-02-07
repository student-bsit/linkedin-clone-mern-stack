import express from 'express';
import { getCurrentUser, getProfile, getSuggestedUser, search, updatePofile } from '../controllers/user.controller.js';
import isAuth from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';
const userRouter = express.Router();

userRouter.get("/currentUser", isAuth, getCurrentUser);

userRouter.put("/updateProfile", isAuth, upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
]), updatePofile)

userRouter.get("/profile/:userName", isAuth, getProfile);
userRouter.get("/search", isAuth, search);
userRouter.get("/sugestedUser", isAuth, getSuggestedUser);


export default userRouter;
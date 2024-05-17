import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,  
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

// User Route
userRouter.post("/", registerUser);
userRouter.post("/auth", authUser);
userRouter.post("/logout", logoutUser);
userRouter
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect,upload.single('image') ,updateUserProfile);

export default userRouter;

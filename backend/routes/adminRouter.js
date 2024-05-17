import express from "express";

import {
  addNewuser,
  authAdmin,
  deleteUser,
  getUsers,
  logoutAdmin,
  updateUser,
} from "../controllers/adminController.js";
import upload from "../middleware/multer.js";
import { adminProtect } from "../middleware/adminAuthMiddleware.js";

const adminRouter = express.Router();

adminRouter.post("/", authAdmin);
adminRouter.post("/logout", logoutAdmin);
adminRouter
  .route("/users")
  .get(adminProtect, getUsers)
  .post(adminProtect, upload.single("image"), addNewuser)
  .delete(adminProtect, deleteUser)
  .put(adminProtect ,upload.single('image'),updateUser)

export default adminRouter;

// ================================= User Controller ================================= \\

import asynHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../model/userModel.js";
import cloudinary from "../utils/cloudinary.js";

// ================================= Login ================================= \\
const authUser = asynHandler(async (req, res) => {

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id,"userJwt");
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
    });
  
  } else {
    res.status(400).json({ message : "Invalid email or password"})
    throw new Error("Invalid email or password");
  }
});

// ================================= Register User ================================= \\
const registerUser = asynHandler(async (req, res) => {

  const { name, email, password } = req.body;

  const exitsUser = await User.findOne({ email });
  if (exitsUser) {
    res.status(400)
    throw new Error("user already exits , smae email");
  }

  const newUser = await User.create({
    name,
    email,
    password,
  });

  if (newUser) {
    generateToken(res, newUser._id,'userJwt');
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      profileImage: newUser.profileImage,
    });
  
  } else {
    res.status(401).json({ message : "Invalid User Information"})
    throw new Error("Invalid User");
  }
});

// ================================= Logout user ================================= \\
const logoutUser = asynHandler(async (req, res) => {
  res.cookie("userJwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "logout User" });
});

// ================================= Get UserProfile ================================= \\
const getUserProfile = asynHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    profileImage: user.profileImage,
  };
  console.log(user);

  res.status(200).json(user);
});

// ================================= Update UserProfile ================================= \\
const updateUserProfile = asynHandler(async (req, res) => {

  const user = await User.findById(req.user._id); 

  // distroying exiting profileImage
  if (user.profileImage) {
    const publicIdMatch = user.profileImage.match(/\/([^/]+)$/);
    if (publicIdMatch && publicIdMatch[1]) {
      const publicId = publicIdMatch[1];
      await cloudinary.uploader.destroy(publicId);
    } else {
      console.log("No publiId found in profileImage Url");
    }
  }

  // Uploding / updating the profileImage
  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path);
      user.profileImage = result.secure_url;
    } catch (error) {
      return res.status(400).json({ error: "Failed to upload to cloudinary" });
    }
  }

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }
    // update Completed 
    const updateUser = await user.save();

    res.status(201).json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      profileImage : updateUser.profileImage
    });
    // send updated UserData in json Object
  } else {
    res.status(404).json({ message : "User not found"})
    throw new Error("User not found");
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};

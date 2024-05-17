// ================================= Admin Controller ================================= \\

import asyncHandler from "express-async-handler";
import User from "../model/userModel.js";
import cloudinary from "../utils/cloudinary.js";
import generateToken from "../utils/generateToken.js";

// ================================= auth Admin ================================= \\
const authAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await User.findOne({ email });

  if (admin && admin.isAdmin && (await admin.matchPassword(password))) {
    generateToken(res, admin._id, "adminJwt");

    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      profileImage: admin.profileImage,
    });
  } else {
    res.status(400).json({ message: "Your not a admin" });
    throw new Error("Invalid password or email");
  }
});

// ================================= Logout ================================= \\
const logoutAdmin = asyncHandler(async (req, res) => {
  res.cookie("adminJwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Admin logout" });
});

// ================================= getUsers ================================= \\
const getUsers = asyncHandler(async (req, res) => {
  const usersData = await User.find({ isAdmin: { $ne: true } });

  res.status(200).json(usersData);
});

// ================================= update User ================================= \\
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body._id);

  if (user) {
    if (user.profileImage) {
      const publicIdMatch = user.profileImage.match(/\/([^/]+)$/);
      if (publicIdMatch && publicIdMatch[1]) {
        const publicId = publicIdMatch[1];
        await cloudinary.uploader.destroy(publicId);
      } else {
        console.log("no publicId match in profileImage URL");
      }
    }

    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path);
        user.profileImage = result.secure_url;
      } catch (error) {
        console.log("failed to upload in cloudinary");
        res.status(400).json({ error: "Failed to upload image to cloudinary" });
      }
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || req.email;
    user.password = req.body.password || req.password;

    const updateUser = await user.save();
    console.log("updated");
    res.status(201).json({
      _id: user._id,
      name: updateUser.name,
      email: updateUser.name,
      email: updateUser.email,
      profileImage: updateUser.profileImage,
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

// ================================= add NewUser ================================= \\
const addNewuser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  let imageUrl = "https://avatar.iran.liara.run/public/48";

  const existsUser = await User.findOne({ email });
  if (existsUser) {
    res.status(400).json({ message: "user is already exists" });
    throw new Error("user is already exists");
  }

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);
    imageUrl = result.secure_url || null;
  }

  const newUser = await User.create({
    name,
    email,
    password,
    profileImage: imageUrl,
  });

  if (newUser) {
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      profileImage: imageUrl,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// ================================= delete User ================================= \\
const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const deletUser = await User.findOne({ _id: userId });
  await User.deleteOne({ _id: userId });
  res.cookie("userJwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json(deletUser);
});

export { authAdmin, logoutAdmin, getUsers, updateUser, addNewuser, deleteUser };

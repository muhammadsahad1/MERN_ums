import asynHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../model/userModel.js";

// ================================= Login ================================= \\
const authUser = asynHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
    console.log(user);
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

// ================================= Register User ================================= \\
const registerUser = asynHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const exitsUser = await User.findOne({ email });
  if (exitsUser) {
    res.status(400);
    throw new Error("user already exits , smae email");
  }

  const newUser = await User.create({
    name,
    email,
    password,
  });

  if (newUser) {
    generateToken(res, newUser._id);
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    });
    console.log(newUser);
  } else {
    res.status(400);
    throw new Error("Invalid User");
  }
});

// ================================= Logout user ================================= \\
const logoutUser = asynHandler(async (req, res) => {
  res.cookie("jwt", "", {
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
  };
  console.log(user);

  res.status(200).json(user);
});

// ================================= Update UserProfile ================================= \\
const updateUserProfile = asynHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;

      const updateUser = await user.save();
      res.status(201).json({
        _id: updateUser._id,
        name: updateUser.name,
        email: updateUser.email,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  }
  res.status(200).json({ message: "updated User" });
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};

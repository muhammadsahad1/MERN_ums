import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import User from "../model/userModel.js";                                      

const protect = expressAsyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.userJwt;

  console.log('token',token)
  if (token) {
    try {
      // verifying with the userId , for checking the userId  correct or exits 
      const decoded = jwt.verify(token,process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select('-password');

      next();

    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export { protect  }
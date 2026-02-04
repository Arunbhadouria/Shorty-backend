import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();


export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) { throw new AppError("You are not logged in", 401) };

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if(!user) {
      throw new AppError("User no longer exists", 401);
    }

    req.user = user;
    next();
  } catch (error){
    next(error);
  }

};
import { AppError } from "../utils/AppError.js";
import { signToken } from "../utils/jwt.js";
import User from "../models/User.js";

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Email and Password are required!!", 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError("User already exists please login", 409);
    }

    const newUser = await User.create({ email, password, });
    const token = signToken(newUser._id);

    res.status(201).json({
      status: "success",
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Email and Password are required!!", 400);
    }

    const existingUser = await User.findOne({ email }).select("+password");

    if (!existingUser || !(await existingUser.comparePassword(password))) {
      throw new AppError("Invalid Email or Password", 401);
    }

    const token = signToken(existingUser._id);
    res.status(201).json({
      status: "success",
      token,
    });
  } catch (error) {
    next(error);
  }
};
import jwt from "jsonwebtoken";

export const signToken = (userID) => {
  return jwt.sign(
    {id : userID},
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};
import { AppError } from "../utils/AppError.js";

export const errorHandler = (err, req, res, next) => {
  console.log("SAME CLASS:", err.constructor === AppError);
console.log("CLASS NAME:", err.constructor.name);

  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Internal server Error";

  res.status(statusCode).json({
    success : false,
    message,
  });
};
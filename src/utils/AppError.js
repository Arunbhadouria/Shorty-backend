export class AppError extends Error{
  constructor(message, statusCode){
    super(message);

    console.log("🔥 AppError constructor executed");


    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
};
import { Router } from "express";
import { register,login } from "../controllers/auth.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", asyncHandler(register));

router.post("/login", asyncHandler(login));

router.get("/me",protect,(req,res) => {
  res.json({
    success : true,
    user : req.user,
  });
});

export default router;
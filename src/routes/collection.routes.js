import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createCollection,
  getCollections,
} from "../controllers/collection.controller.js";

const router = express.Router();

router.use(protect);

router.post("/", createCollection);
router.get("/", getCollections);

export default router;

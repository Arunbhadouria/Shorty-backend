import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { createLink } from "../controllers/link.controller.js";
import { getLinkAnalytics } from "../controllers/link.controller.js";
import { getUserLinks } from "../controllers/link.controller.js";
import { deleteLink } from "../controllers/link.controller.js";
import { toggleLinkStatus } from "../controllers/link.controller.js";

const router = express.Router();

router.get("/", protect, getUserLinks);
router.post("/", protect, createLink);

router.get("/:id/analytics", protect, getLinkAnalytics);

router.delete("/:id", protect, deleteLink);

router.patch("/:id/toggle", protect, toggleLinkStatus);

export default router;
import Link from "../models/Link.js";
import { generateShortCode } from "../utils/generateShortCode.js";
import { AppError } from "../utils/AppError.js";
import ClickEvent from "../models/clickEvent.js";
import Collection from "../models/Collection.js";
import mongoose from "mongoose";

/* =========================
   Create Link
========================= */
export const createLink = async (req, res, next) => {
  try {
    const { originalUrl, collectionId, expiresAt } = req.body;

    if (!originalUrl) {
      throw new AppError("Original URL is required", 400);
    }

    // Normalize URL
    let normalizedUrl = originalUrl;
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    /* Validate collection ownership */
    let collection = null;

    if (collectionId) {
      collection = await Collection.findOne({
        _id: collectionId,
        user: req.user._id,
      });

      if (!collection) {
        throw new AppError("Collection not found", 404);
      }
    }

    /* Collision-safe shortcode */
    let shortCode;
    let exists = true;

    while (exists) {
      shortCode = generateShortCode();
      exists = await Link.findOne({ shortCode });
    }

    const link = await Link.create({
      originalUrl: normalizedUrl,
      shortCode,
      user: req.user._id,
      collection: collection ? collection._id : null,
      expiresAt: expiresAt || null,
    });

    res.status(201).json({
      status: "success",
      data: link,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   Redirect
========================= */
export const redirectToOriginal = async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    const link = await Link.findOne({ shortCode });

    if (!link || !link.isActive) {
      throw new AppError("Link not found", 404);
    }

    if (link.expiresAt && link.expiresAt < new Date()) {
      throw new AppError("Link expired", 410);
    }

    await ClickEvent.create({
      link: link._id,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.redirect(link.originalUrl);
  } catch (error) {
    next(error);
  }
};

/* =========================
   Analytics
========================= */
export const getLinkAnalytics = async (req, res, next) => {
  try {
    const { id } = req.params;

    const link = await Link.findById(id);

    if (!link) {
      throw new AppError("Link not found", 404);
    }

    if (link.user.toString() !== req.user._id.toString()) {
      throw new AppError("Not authorized", 403);
    }

    const totalClicks = await ClickEvent.countDocuments({
      link: id,
    });

    const dailyClicks = await ClickEvent.aggregate([
      { $match: { link: new mongoose.Types.ObjectId(id) } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          clicks: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      status: "success",
      data: {
        totalClicks,
        dailyClicks,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   User Links
========================= */
export const getUserLinks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const totalLinks = await Link.countDocuments({
      user: req.user._id,
    });

    const links = await Link.find({ user: req.user._id })
      .populate("collection", "name") // NEW
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      status: "success",
      page,
      totalPages: Math.ceil(totalLinks / limit),
      results: links.length,
      totalLinks,
      data: links,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   Delete Link
========================= */
export const deleteLink = async (req, res, next) => {
  try {
    const { id } = req.params;

    const link = await Link.findById(id);

    if (!link) {
      throw new AppError("Link not found", 404);
    }

    if (link.user.toString() !== req.user._id.toString()) {
      throw new AppError("Not authorized to delete this link", 403);
    }

    await link.deleteOne();

    res.json({
      status: "success",
      message: "Link deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   Toggle Link Status
========================= */
export const toggleLinkStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const link = await Link.findById(id);

    if (!link) {
      throw new AppError("Link not found", 404);
    }

    if (link.user.toString() !== req.user._id.toString()) {
      throw new AppError("Not authorized", 403);
    }

    link.isActive = !link.isActive;
    await link.save();

    res.json({
      status: "success",
      isActive: link.isActive,
    });
  } catch (error) {
    next(error);
  }
};

import mongoose from "mongoose";

const clickEventSchema = new mongoose.Schema(
  {
    link: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Link",
      required: true,
      index: true,
    },

    ipAddress: {
      type: String,
    },

    userAgent: {
      type: String,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  }
);

const ClickEvent = mongoose.model("ClickEvent", clickEventSchema);

export default ClickEvent;
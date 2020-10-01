const mongoose = require("mongoose");
const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");

const conversationSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model("conversation", conversationSchema);
module.exports = Conversation;

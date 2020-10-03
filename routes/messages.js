const { Router } = require("express");
const User = require("../models/User");
const mongoose = require("mongoose");
const { requireAuth, checkUser } = require("../middleware/authMiddleware");
const Conversation = require("../models/conversation");

const router = Router();

router.get("/message/:username", requireAuth, async (req, res) => {
  res.render("message", { clientusername: res.locals.user });
});
module.exports = router;

const { Router } = require("express");
const User = require("../models/User");
const mongoose = require("mongoose");
const { requireAuth, checkUser } = require("../middleware/authMiddleware");
const Conversation = require("../models/conversation");
const checkfriend = require("../middleware/friencheckmiddleware");

const router = Router();

router.get("/message/:ok", requireAuth, checkfriend, async (req, res) => {
  let username = res.locals.user.username;
  let to_username = req.params.ok;
  console.log(to_username);
  let to_user_id = await User.findOne({ username: to_username });
  //console.log(to_user_id);
  to_user_id = to_user_id._id;
  let user_id = res.locals.user._id;
  let onk = [];

  let kek = await Conversation.find({
    $or: [
      { from: user_id, to: to_user_id },
      { from: to_user_id, to: user_id },
    ],
  })
    .sort({ created_at: -1 })
    .exec();

  //console.log(kek);
  for (let i of kek) {
    let fromname = (await User.findById(i.from)).username;
    let toname = (await User.findById(i.to)).username;
    onk.push([i.from, fromname, i.to, toname, i.message, i.createdAt]);
  }

  res.render("message", { clientusername: res.locals.user, msges: onk });
});
module.exports = router;

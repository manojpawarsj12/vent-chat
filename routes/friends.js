const { Router } = require("express");
const User = require("../models/User");
const mongoose = require("mongoose");
const { requireAuth, checkUser } = require("../middleware/authMiddleware");
const Conversation = require("../models/conversation");

const router = Router();

router.get("/friends", requireAuth, async (req, res) => {
  let username = res.locals.user.username;
  let user_id = res.locals.user._id;
  let fr_username = await User.findOne({ username: username });
  let friendlist = fr_username.friends;
  //console.log(friendlist);
  let to_user_id = 0;
  let ongay = [];
  for (friend of friendlist) {
    to_user_id = friend;
    //let fr_name = (await User.findById(friend)).username;
    let kek = await Conversation.find({
      $or: [
        { from: user_id, to: to_user_id },
        { from: to_user_id, to: user_id },
      ],
    })
      .sort({ created_at: -1 })
      .exec();
    kek = kek[kek.length - 1];
    let fromname = (await User.findById(kek.from)).username;
    let toname = (await User.findById(kek.to)).username;
    ongay.push([kek.from,fromname,kek.to,toname,kek.createdAt,kek.message]);
  }
  //console.log(ongay);
  res.json(ongay);
});

module.exports = router;

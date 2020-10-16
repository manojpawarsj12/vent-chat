const { Router } = require("express");
const User = require("../models/User");
const mongoose = require("mongoose");
const { requireAuth, checkUser } = require("../middleware/authMiddleware");
const Conversation = require("../models/conversation");

const router = Router();

router.get("/friends", requireAuth, async (req, res) => {
  try {
    let username = res.locals.user.username;
    let user_id = res.locals.user._id;
    let fr_username = await User.findOne({ username: username });
    let friendlist = fr_username.friends;
    //console.log(friendlist);
    let to_user_id = 0;
    let conversation_array = [];
    for (friend of friendlist) {
      to_user_id = friend;
      //let fr_name = (await User.findById(friend)).username;
      let conversations = await Conversation.find({
        $or: [
          { from: user_id, to: to_user_id },
          { from: to_user_id, to: user_id },
        ],
      })
        .sort({ created_at: -1 })
        .exec();
      conversations = conversations[conversations.length - 1];
      console.log(conversations);
      let fromname = (await User.findById(conversations.from)).username;
      let toname = (await User.findById(conversations.to)).username;
      conversation_array.push([
        conversations.from,
        fromname,
        conversations.to,
        toname,
        conversations.createdAt,
        conversations.message,
      ]);
    }

    //console.log(ongay);
    res.json(conversation_array);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

module.exports = router;

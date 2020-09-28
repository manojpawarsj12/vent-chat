const { Router } = require("express");
const User = require("../models/User");
const mongoose = require("mongoose");
const { requireAuth, checkUser } = require("../middleware/authMiddleware");

const router = Router();

router.get("/friendrequests/:username", requireAuth, async (req, res) => {
  let username = req.params.username;
  try {
    let friendrequest = await User.findOne({ username: username });
    let friends = await User.find()
      .where("_id")
      .in(friendrequest.friendrequest)
      .exec();
    let friend_names = friends.map((x) => x.username);
    res.json(friend_names);
  } catch (err) {
    console.log(err);
  }
});
router.get("/friendrequests", requireAuth, async (req, res) => {
  let username = res.locals.user.username;
  try {
    let friendrequest = await User.findOne({ username: username });
    let friends = await User.find()
      .where("_id")
      .in(friendrequest.friendrequest)
      .exec();
    let friend_names = friends.map((x) => x.username);
    res.json(friend_names);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;

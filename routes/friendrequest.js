const { Router } = require("express");
const User = require("../models/User");
const mongoose = require("mongoose");
const { requireAuth, checkUser } = require("../middleware/authMiddleware");
const checkUserexist = require("../middleware/checkuser");

const router = Router();

router.get(
  "/friendrequests/:username",
  requireAuth,
  checkUserexist,
  async (req, res) => {
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
  }
);
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

router.get(
  "/sendfriendrequest/:username",

  requireAuth,
  checkUserexist,
  async (req, res) => {
    let from = res.locals.user.username;
    let to = req.params.username;
    try {
      let ids = await User.findOne({ username: to });
      id = ids._id;
      let user = await User.findOne({ username: from });
      user.friendrequest.addToSet(mongoose.Types.ObjectId(id));
      ids.friendrequest.addToSet(mongoose.Types.ObjectId(user._id));
      Promise.all([user.save(), ids.save()]).then(() => {
        console.log("sucess friendrequest");
      });
      res.json("done");
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  }
);

module.exports = router;

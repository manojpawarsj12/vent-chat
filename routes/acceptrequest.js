const { Router } = require("express");
const User = require("../models/User");
const mongoose = require("mongoose");
const { requireAuth, checkUser } = require("../middleware/authMiddleware");

const router = Router();

router.get("/acceptreq/:username", requireAuth, async (req, res) => {
  try {
    let tousername = req.params.username;
    let fromusername = res.locals.user.username;
    let to_friendsdb = await User.findOne({ username: tousername });
    let from_friendsdb = await User.findOne({ username: fromusername });
    let to_id = to_friendsdb._id;
    let from_id = from_friendsdb._id;

    console.log(from_friendsdb._id, to_friendsdb._id);
    from_friendsdb.friendrequest.pull(to_id);
    from_friendsdb.friends.addToSet(to_id);
    to_friendsdb.friendrequest.pull(from_id);
    to_friendsdb.friends.addToSet(from_id);

    from_friendsdb = await from_friendsdb.save();
    to_friendsdb = await to_friendsdb.save();

    res.json("done");
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

module.exports = router;

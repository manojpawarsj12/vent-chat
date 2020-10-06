const { Router } = require("express");
const User = require("../models/User");
const mongoose = require("mongoose");
const { requireAuth, checkUser } = require("../middleware/authMiddleware");

const router = Router();

router.get("/search/:username", requireAuth, async (req, res) => {
  let username = req.params.username;
  let userslist = [];
  if (username) {
    try {
      let user = await User.find({ username: username });
      for(let i of user)
      {
        userslist.push(i.username)
      }
      res.json(userslist)
    } catch (err) {
      console.log(err);
      res.json("no user found");
    }
  }
});

module.exports = router;

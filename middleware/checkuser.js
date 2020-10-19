const User = require("../models/User");
const mongoose = require("mongoose");
const { requireAuth, checkUser } = require("../middleware/authMiddleware");

const checkUserexist = async (req, res, next) => {
  try {
    let to = req.params.username;
    let to_user_db = await User.findOne({ username: to });
    if (to_user_db) {
      next();
    } else {
      res.json("user doesnot exist");
    }
  } catch (err) {
    console.log(err);
    res.json(err);
  }
};

module.exports = checkUserexist;

const User = require("../models/User");

const checkfriends = async (req, res, next) => {
  try {
    let to_user_name = req.params.ok;
    let from_user_name = res.locals.user.username;
    let from_user_friends = (await User.findOne({ username: from_user_name }))
      .friends;
    let to_user_id = (await User.findOne({ username: to_user_name }))._id;
    let flag = false;
    flag = from_user_friends.some(function (user) {
      return user.equals(to_user_id);
    });
    if (flag) {
      next();
    } else {
      res.json("you're not friend");
    }
  } catch (err) {
    res.json(err);
  }
};

module.exports = checkfriends;

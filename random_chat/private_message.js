const User = require("../models/User");
const mongoose = require("mongoose");
const Conversation = require("../models/conversation");
const socketauthmiddleware = require("./socketauthmiddlware");

function private_chat(io) {
  socketauthmiddleware(io);

  let users = {};
  io.on("connection", function (socket) {
    console.log("connection established");
    socket.on("JOINROOM", function (req) {
      users[req.name] = socket.id;
      console.log(users);
    });
    socket.on("private_message", async function (data) {
      //console.log(users[data.to]);
      try {
        io.to(users[data.to]).emit("privatemsg", data);
        let to_friendsdb = (await User.findOne({ username: data.to }))._id;
        let from_friendsdb = (await User.findOne({ username: data.from }))._id;

        //pending add message to database
        console.log(to_friendsdb, from_friendsdb);
        let msg = data.msg;
        console.log(msg);
        let new_text = new Conversation({
          from: from_friendsdb,
          to: to_friendsdb,
          message: msg,
        });
        new_text  = await new_text.save(function (err, result) {
          if (err) {
            console.log(err);
          } else {
            console.log("msg saved");
          }
        });
      } catch (err) {
        console.log(err);
      }
    });
    socket.on("disconnect", function () {
      for (var i in users) {
        if (users[i] === socket.id) {
          delete users[i];
        }
      }
    });
  });
}

module.exports = private_chat;

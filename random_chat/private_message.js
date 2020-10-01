const User = require("../models/User");
const mongoose = require("mongoose");
const Conversation = require("../models/conversation");
function private_chat(io) {
  let users = {};
  io.on("connection", function (socket) {
    console.log("connection established");
    socket.on("JOINROOM", function (req) {
      users[req] = socket.id;
    });
    socket.on("private_message", function (data) {
      users[data.to].emit("privatemsg", data);
      //pending add message to database
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

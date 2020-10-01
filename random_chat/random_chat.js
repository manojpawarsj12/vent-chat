const User = require("../models/User");
const mongoose = require("mongoose");

function randomchatfu(io) {
  let userData = 0;
  let clientInfo = {};
  let queue = [];
  var matchedName = "";
  var roomName = "";
  var name = "";

  io.on("connection", function (socket) {
    console.log("User connected");
    // Disconnect Event Handler
    socket.on("disconnect", function () {
      // If socket is still in queue remove that too
      var index = queue.indexOf(socket);
      if (index > -1) {
        queue.splice(index, 1);
      }

      userData = clientInfo[socket.id];
      if (userData) {
        var partnerId = clientInfo[socket.id].partner;
        var partnerData = clientInfo[partnerId];
      }

      if (
        typeof userData !== "undefined" &&
        typeof partnerData !== "undefined"
      ) {
        io.to(userData.room).emit("message", {
          name: "System",
          text:
            userData.name +
            " has left! Please restart page to find a new matchup.",
          timestamp: Date.now(),
        });

        io.to(userData.room).emit("user_left", {
          username: userData.name,
        });

        socket.leave(clientInfo[socket.id]);
        socket.leave(clientInfo[partnerId]);
        delete clientInfo[socket.id];
        delete clientInfo[partnerId];
      }
    });

    // Join Room Event Handler
    socket.on("joinRoom", function (req) {
      socket.emit("message", {
        name: "System",
        text: "Welcome to chat-matchmaking, we are matching you now!",
        timestamp: Date.now(),
      });

      clientInfo[socket.id] = req;
      if (queue.length > 0) {
        matchedSocket = queue.pop();
        roomName = socket.id + "#" + matchedSocket.id;
        name = clientInfo[socket.id].name;
        matchedName = clientInfo[matchedSocket.id].name;

        socket.join(roomName);
        matchedSocket.join(roomName);

        // Update ClientInfo
        clientInfo[socket.id].room = roomName;
        clientInfo[socket.id].partner = matchedSocket.id;
        clientInfo[matchedSocket.id].room = roomName;
        clientInfo[matchedSocket.id].partner = socket.id;

        matchedSocket.in(roomName).emit("message", {
          name: "System",
          text: "You have been matched! Say hi to " + matchedName + " !",
          timestamp: Date.now(),
        });

        socket.in(roomName).emit("message", {
          name: "System",
          text: "You have been matched! Say hi to " + name + " !",
          timestamp: Date.now(),
        });
        socket.in(roomName).emit("otheruserevent", {
          matchedName: name,
        });
      } else {
        clientInfo[socket.id].room = null;
        clientInfo[socket.id].partner = null;
        queue.push(socket);
      }
      console.log(clientInfo);
    });

    // Message Event Handler
    socket.on("message", function (message) {
      //console.log("Message being broadcast: " + message.text);

      if (message.text === "@currentUsers") {
        sendCurrentUsers(socket);
      } else {
        io.to(clientInfo[socket.id].room).emit("message", message);
      }
    });

    socket.on("sendfriendreq", async function (frienddata) {
      let from = frienddata.from;
      let to = undefined;
      if (from === name) {
        to = matchedName;
      }
      if (from === matchedName) {
        to = name;
      }
      console.log(from, to);
      if (to) {
        try {
          let ids = await User.findOne({ username: to });
          id = ids._id;
          let user = await User.findOne({ username: from });
          user.friendrequest.addToSet(mongoose.Types.ObjectId(id));
          ids.friendrequest.addToSet(mongoose.Types.ObjectId(user._id));
          user.save();
          ids.save();
        } catch (err) {
          console.log(err);
        }
      }
    });
  });

  // Helpers
  function sendCurrentUsers(socket) {
    var info = clientInfo[socket.id];
    var users = [];

    if (typeof info === "undefined") {
      return;
    }

    Object.keys(clientInfo).forEach(function (socketId) {
      var userInfo = clientInfo[socketId];
      if (info.room == userInfo.room) {
        users.push(userInfo.name);
      }
    });

    socket.emit("message", {
      name: "System",
      text: "Current users: " + users.join(","),
      timestamp: Date.now(),
    });
  }
}

module.exports = randomchatfu;

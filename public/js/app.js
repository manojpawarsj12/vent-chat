var name;
name = sessionStorage.getItem("name");

var socket = io();

console.log(name);

// Connection Event Handler
socket.on("connect", function () {
  console.log("Connected to server");
  socket.emit("joinRoom", {
    name: name,
  });
});

// Message Event Handler
socket.on("message", function (message) {
  console.log(message);
  var timestamp = moment.utc(message.timestamp);
  const newNode = document.createElement("div");
  newNode.innerHTML = `<b>${message.name}:&nbsp;</b> ${message.text}`;
  document.getElementById("messages").appendChild(newNode);
});

// Form Submission Event Handler

let message_input = document.getElementById("message_input");

document.getElementById("message_input_form").onsubmit = function (e) {
  e.preventDefault();
  let chattext = message_input.value.trim();
  if (chattext.length) {
    socket.emit("message", {
      name: name,
      text: chattext,
    });
  }
};
message_input.value = "";
message_input.focus();

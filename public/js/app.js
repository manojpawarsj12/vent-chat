var name;
//let url = new URL(window.location);
const url = decodeURI(window.location).replace( /\+/g, ' ' );

name = url.slice(url.indexOf("=") + 1, url.length);

var socket = io();

// Connection Event Handler
socket.on("connect", function () {
  console.log("Connected to server");
  socket.emit("joinRoom", {
    name: name,
  });
});

// Message Event Handler
socket.on("message", function (message) {
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
  document.getElementById("message_input").value = "";
};
message_input.value = "";
message_input.focus();

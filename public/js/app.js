let check = false;
let name = "";
let topkek = document.getElementById("topkek");
let topkek2 = document.getElementById("topkek2");
function get_username() {
  name = document.getElementById("names");
  document.getElementById("username_submit").onsubmit = function (e) {
    name = name.value;
    console.log(name);
    hide();
    show();
    e.preventDefault();
  }
}
function show() {
  check = true;
  topkek2.classList.remove("hidden");
}
function hide() {
  check = false;
  topkek.classList.add("hidden");
}

let socket = io();

// Connection Event Handler
socket.on("connect", function () {
  console.log("Connected to server");
  get_username();
  socket.emit("joinRoom", {
    name: name,
  });
});

// Message Event Handler
socket.on("message", function (message) {
  console.log(message);

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

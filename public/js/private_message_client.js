var name = names;
let cook = document.cookie;
cook = cook.slice(4, cook.length)


const socket = io("http://localhost:3000", {
  query: {
    token: cook,
  },
});

socket.on("connect", function () {
  console.log("Connected to server");
  socket.emit("JOINROOM", {
    name: name,
  });
});
socket.on("privatemsg", function (message) {
  console.log(message);
  const newNode = document.createElement("div");
  newNode.innerHTML = `<b>${message.to}:&nbsp;</b> ${message.msg}`;
  document.getElementById("messages").appendChild(newNode);
  //chatContainer.scrollTop = chatContainer.scrollHeight;
});

let message_input = document.getElementById("message_input");
let from = name;
var url_string = window.location.href;
var url = new URL(url_string);
var to = window.location.pathname;
to = to.slice(9, to.length)
console.log(to);
document.getElementById("message_input_form").onsubmit = function (e) {
  e.preventDefault();

  let chattext = message_input.value.trim();
  if (chattext.length) {
    socket.emit("private_message", {
      from: from,
      to: to,
      msg: chattext,
    });
  }
  document.getElementById("message_input").value = "";
};
message_input.value = "";
message_input.focus();
 

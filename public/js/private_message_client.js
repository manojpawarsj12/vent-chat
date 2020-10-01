const socket = io();

socket.on("private_message", function (message) {
  console.log(message);
  const newNode = document.createElement("div");
  newNode.innerHTML = `<b>${message.name}:&nbsp;</b> ${message.text}`;
  document.getElementById("messages").appendChild(newNode);
  chatContainer.scrollTop = chatContainer.scrollHeight;
});

let message_input = document.getElementById("message_input");

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

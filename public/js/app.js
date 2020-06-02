
$(document).ready(function () {
   var name = getQueryVariable('name') || 'Anonymous';
   var room = getQueryVariable('room');
   var socket = io();

   console.log(name + ' is requesting to join room ' + room);


   // Connection Event Handler
   socket.on('connect', function () {
      console.log('Connected to server');
      socket.emit('joinRoom', {
         name: name
      });
   });

   // Message Event Handler
   socket.on('message', function (message) {
      var timestamp = moment.utc(message.timestamp);
      const newNode = document.createElement('div');
      newNode.innerHTML = `<b>${message.name}:&nbsp;</b> ${message.text}`;
      document.getElementById('messages').appendChild(newNode);
   });

   // Form Submission Event Handler

   let message_input = document.getElementById('message_input');

   document.getElementById('message_input_form').onsubmit = function (e) {
      e.preventDefault();
      let chattext = message_input.value.trim();
      if (chattext.length) {
         socket.emit('message', {
            name: name,
            text: chattext
         });
      }
}
message_input.value = '';
message_input.focus();
});
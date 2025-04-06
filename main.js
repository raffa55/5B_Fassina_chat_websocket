app.use("/", express.static(path.join(__dirname, "public")));
const server = http.createServer(app);
const io = new Server(server);
io.on('connection', (socket) => {
   console.log("socket connected: " + socket.id);
   io.emit("chat", "new client: " + socket.id);
   socket.on('message', (message) => {
      const response = socket.id + ': ' + message;
      console.log(response);
      io.emit("chat", response);
   });
});

const input = document.getElementById("input");
const button = document.getElementById("sendButton");
const chat = document.getElementById("chat");

const template = "<li class=\"list-group-item\">%MESSAGE</li>";
const messages = [];

const socket = io();

input.onkeydown = (event) => {
  
  if (event.keyCode === 13) {
      event.preventDefault();
      button.click();
  }
}

button.onclick = () => {
  socket.emit("message", input.value);
  input.value = "";
}

socket.on("chat", (message) => {
  console.log(message);
  messages.push(message);
  render();
})

const render = () => {
  let html = "";
  messages.forEach((message) => {
    const row = template.replace("%MESSAGE", message);
    html+=row;
  });
  chat.innerHTML = html;
  window.scrollTo(0, document.body.scrollHeight);
}

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const new_server = http.createServer(app);
const _io = socketIo(server);

let userList = [];


app.use(express.static('public')); 


io.on('connection', (socket) => {
    console.log('Un utente si è connesso:', socket.id);

    socket.on('newUser', (name) => {
        userList.push({ socketId: socket.id, name });
        io.emit('list', userList);
    });

    socket.on('disconnect', () => {
        console.log('Utente disconnesso:', socket.id);
        userList = userList.filter(user => user.socketId !== socket.id);
        io.emit('list', userList);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}`);
});
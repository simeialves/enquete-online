const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/logs", (req, res) => {
  const teste = req.body;
  console.log(teste);

  io.emit("chat message", teste);

  res.json("teste");
});

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    const mensagem = "Simei: " + msg;
    io.emit("chat message", mensagem);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/newSurvey", (req, res) => {
  const { msg } = req.body;

  io.emit("chat message", "Enquete Criada: " + msg);

  res.status(200);
});

app.post("/addSurveyItem", (req, res) => {
  const { msg } = req.body;

  io.emit("chat message", "Opção: " + msg);

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

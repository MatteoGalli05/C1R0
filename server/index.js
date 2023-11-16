const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());
const server = http.createServer(app);

const fs = require("fs");

const io = new Server(server, {
  cors: {
    //origin : 'http://192.168.1.5:3000',
    origin: "http://172.20.10.2:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("sendData", (data) => {
    io.emit("msg_recived", "true");
    let dataToSave = fs.readFileSync("../order.txt") + data;
    fs.writeFileSync("../order.txt", dataToSave, (e) =>{
      if(er) throw er;
    });
  });
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING!");
});

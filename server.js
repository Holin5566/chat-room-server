const express = require("express");
const app = express();
const mysql = require("mysql");
//secret
const con = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "123456",
  database: "test",
});

//連接MySQL
con.connect(function (err) {
  if (err) {
    console.log("connecting error");
    return;
  }
  console.log("connecting success");
});

app.use(function (req, res, next) {
  req.con = con;
  next();
});

//將 express 放進 http 中開啟 Server 的 3300 port ，正確開啟後會在 console 中印出訊息
const server = require("http")
  .Server(app)
  .listen(process.env.PORT || 3300, () => {
    console.log("open server!");
  });

//將啟動的 Server 送給 socket.io 處理
const io = require("socket.io")(server, {
  //解決cors問題
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

/*上方為此寫法的簡寫：
  const socket = require('socket.io')
  const io = socket(server)
*/

//監聽 Server 連線後的所有事件，並捕捉事件 socket 執行
// socket = 連接端 = 客戶端
io.on("connection", (socket) => {
  //經過連線後在 console 中印出訊息
  console.log("success connect!");
  //監聽透過 connection 傳進來的事件 someOneSay
  socket.on("someOneSay", (message) => {
    //回傳 message 給所有 Client
    console.log("event:someOneSay content: " + message);
    io.emit("someOneSay", message);
  });

  //監聽透過 connection 傳進來的事件 someOneCome
  socket.on("someOneCome", (message) => {
    //回傳 message 給發送訊息的 Client
    console.log("event:someOneCome content: " + message);
    io.emit("someOneSay", message);
  });
});

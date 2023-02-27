const express = require("express");
const app = express();
const PORT = 1234;
const io = require("socket.io")(3000, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
let usersCount = 0;
let playerUserNames = {};
let userNames;
let timeoutId;
io.on("connection", (socket) => {
  if (usersCount >= 8) {
    socket.disconnect();
    console.log("too much users");
    return;
  }
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  usersCount = usersCount + 1;
  io.emit(
    "connectedUsers",
    true,
    socket.id,
    socket.handshake.address.substring(7)
  );

  const setchartoplayers = () => {
    const charList = ["X", "O"];
    const randomnumtochoose = Math.floor(Math.random() * 2);
    const firstChar = charList[randomnumtochoose];
    const secondChar = charList[randomnumtochoose === 0 ? 1 : 0];
    return [firstChar, secondChar];
  };
  const setstarterturn = () => {
    const turnlist = [true, false];
    const randnumturn = Math.floor(Math.random() * 2);
    const p1turn = turnlist[randnumturn];
    const p2turn = turnlist[randnumturn === 0 ? 1 : 0];
    return [p1turn, p2turn];
  };

  socket.on("setUserName", (userName) => {
    playerUserNames[socket.id] = {
      username: userName,
      id: socket.id,
      isLocal: userNames ? userNames.length % 2 === 0 : true,
    };
    userNames = Object.values(playerUserNames);
    if (userNames.length === 2) {
      const sides = setchartoplayers();
      const turns = setstarterturn();
      for (let pos = 0; pos < userNames.length; pos++) {
        userNames[pos].whatside = sides[pos];
        userNames[pos].ishesturn = turns[pos];
      }
      io.emit("startGame", userNames);
    }
  });
  socket.on("sendTurn", (num, siman) => {
    let foundUser = userNames.find((user) => user.whatside === siman);
    let enemyUser = userNames.find((user) => user.whatside !== siman);
    if (foundUser.ishesturn) {
      foundUser.ishesturn = !foundUser.ishesturn;
      enemyUser.ishesturn = !enemyUser.ishesturn;
      io.emit("sendTurnBroadcast", num, siman, userNames);
    }
  });
  socket.on("checkwinner", (table) => {
    for (let pos = 0; pos < userNames?.length; pos++) {
    if((table[0].siman===userNames[pos].whatside && table[1].siman===userNames[pos].whatside && table[2].siman===userNames[pos].whatside) || (table[3].siman===userNames[pos].whatside && table[4].siman===userNames[pos].whatside && table[5].siman===userNames[pos].whatside) || (table[6].siman===userNames[pos].whatside && table[7].siman===userNames[pos].whatside && table[8].siman===userNames[pos].whatside) || (table[0].siman===userNames[pos].whatside && table[3].siman===userNames[pos].whatside && table[6].siman===userNames[pos].whatside) || (table[1].siman===userNames[pos].whatside && table[4].siman===userNames[pos].whatside && table[7].siman===userNames[pos].whatside) || (table[2].siman===userNames[pos].whatside && table[5].siman===userNames[pos].whatside && table[8].siman===userNames[pos].whatside) || (table[0].siman===userNames[pos].whatside && table[4].siman===userNames[pos].whatside && table[8].siman===userNames[pos].whatside) || (table[2].siman===userNames[pos].whatside && table[4].siman===userNames[pos].whatside && table[6].siman===userNames[pos].whatside)){
      io.emit("winnerfound", userNames[pos]?.username);
      break;
    }
    }
  });

  socket.on("disconnect", () => {
    usersCount = usersCount - 1;
    userNames = null;
    playerUserNames = {};
    io.emit("connectedUsers", false, socket.id);
    timeoutId = setTimeout(() => {
      socket.broadcast.emit("reloadPage");
    }, 4000);
  });
});

app.listen(PORT, (err) => {
  if (!err) {
    console.log("ok");
  } else {
    console.warn("bad");
  }
});

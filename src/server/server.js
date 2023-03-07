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
let playerUserNames = {};
let userNames;
let timeoutId;
io.on("connection", (socket) => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
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

  socket.on("setUserName", (userName, sessionID) => {
    if (
      io.sockets.adapter.rooms.get(sessionID) &&
      io.sockets.adapter.rooms.get(sessionID).size > 1
    ) {
      socket.emit("sendError");
      return;
    }
    socket.join(sessionID);
    io.to(sessionID).emit("connectedUsers", true, userName);
    playerUserNames[socket.id] = {
      username: userName,
      id: socket.id,
      isLocal: userNames ? userNames.length % 2 === 0 : true,
      sessionID: sessionID,
    };
    userNames = Object.values(playerUserNames).filter(
      (player) => player.sessionID === sessionID
    );
    console.log(userNames.length);
    if (userNames.length === 2) {
      const sides = setchartoplayers();
      const turns = setstarterturn();
      for (let pos = 0; pos < userNames.length; pos++) {
        userNames[pos].whatside = sides[pos];
        userNames[pos].ishesturn = turns[pos];
      }
      io.to(sessionID).emit("startGame", userNames);
    }
  });
  socket.on("sendTurn", (num, siman, sessionID) => {
    let foundUser = Object.values(playerUserNames).find(
      (player) => player.sessionID === sessionID && player.whatside === siman
    );
    let enemyUser = Object.values(playerUserNames).find(
      (player) => player.sessionID === sessionID && player.whatside !== siman
    );
    if (!enemyUser) return;
    if (foundUser.ishesturn) {
      foundUser.ishesturn = !foundUser?.ishesturn;
      enemyUser.ishesturn = !enemyUser?.ishesturn;
      io.to(sessionID).emit(
        "sendTurnBroadcast",
        num,
        siman,
        Object.values(playerUserNames).filter(
          (player) => player.sessionID === sessionID
        )
      );
    }
  });
  socket.on("checkwinner", (table, sessionID) => {
    userNames = Object.values(playerUserNames).filter(
      (player) => player.sessionID === sessionID
    );
    let count = 0;
    for (let key in table) {
      if (table[key].isActive) {
        count++;
      }
    }
    for (
      let pos = 0;
      pos <
      Object.values(playerUserNames).filter(
        (player) => player.sessionID === sessionID
      )?.length;
      pos++
    ) {
      if (
        (table[0].siman ===
          Object.values(playerUserNames).filter(
            (player) => player.sessionID === sessionID
          )[pos].whatside &&
          table[1].siman ===
            Object.values(playerUserNames).filter(
              (player) => player.sessionID === sessionID
            )[pos].whatside &&
          table[2].siman ===
            Object.values(playerUserNames).filter(
              (player) => player.sessionID === sessionID
            )[pos].whatside) ||
        (table[3].siman ===
          Object.values(playerUserNames).filter(
            (player) => player.sessionID === sessionID
          )[pos].whatside &&
          table[4].siman ===
            Object.values(playerUserNames).filter(
              (player) => player.sessionID === sessionID
            )[pos].whatside &&
          table[5].siman ===
            Object.values(playerUserNames).filter(
              (player) => player.sessionID === sessionID
            )[pos].whatside) ||
        (table[6].siman ===
          Object.values(playerUserNames).filter(
            (player) => player.sessionID === sessionID
          )[pos].whatside &&
          table[7].siman ===
            Object.values(playerUserNames).filter(
              (player) => player.sessionID === sessionID
            )[pos].whatside &&
          table[8].siman ===
            Object.values(playerUserNames).filter(
              (player) => player.sessionID === sessionID
            )[pos].whatside) ||
        (table[0].siman ===
          Object.values(playerUserNames).filter(
            (player) => player.sessionID === sessionID
          )[pos].whatside &&
          table[3].siman ===
            Object.values(playerUserNames).filter(
              (player) => player.sessionID === sessionID
            )[pos].whatside &&
          table[6].siman ===
            Object.values(playerUserNames).filter(
              (player) => player.sessionID === sessionID
            )[pos].whatside) ||
        (table[1].siman ===
          Object.values(playerUserNames).filter(
            (player) => player.sessionID === sessionID
          )[pos].whatside &&
          table[4].siman ===
            Object.values(playerUserNames).filter(
              (player) => player.sessionID === sessionID
            )[pos].whatside &&
          table[7].siman ===
            Object.values(playerUserNames).filter(
              (player) => player.sessionID === sessionID
            )[pos].whatside) ||
        (table[2].siman ===
          Object.values(playerUserNames).filter(
            (player) => player.sessionID === sessionID
          )[pos].whatside &&
          table[5].siman ===
            Object.values(playerUserNames).filter(
              (player) => player.sessionID === sessionID
            )[pos].whatside &&
          table[8].siman ===
            Object.values(playerUserNames).filter(
              (player) => player.sessionID === sessionID
            )[pos].whatside) ||
        (table[0].siman ===
          Object.values(playerUserNames).filter(
            (player) => player.sessionID === sessionID
          )[pos].whatside &&
          table[4].siman ===
            Object.values(playerUserNames).filter(
              (player) => player.sessionID === sessionID
            )[pos].whatside &&
          table[8].siman ===
            Object.values(playerUserNames).filter(
              (player) => player.sessionID === sessionID
            )[pos].whatside) ||
        (table[2].siman ===
          Object.values(playerUserNames).filter(
            (player) => player.sessionID === sessionID
          )[pos].whatside &&
          table[4].siman ===
            Object.values(playerUserNames).filter(
              (player) => player.sessionID === sessionID
            )[pos].whatside &&
          table[6].siman ===
            Object.values(playerUserNames).filter(
              (player) => player.sessionID === sessionID
            )[pos].whatside)
      ) {
        io.to(sessionID).emit(
          "winnerfound",
          Object.values(playerUserNames).filter(
            (player) => player.sessionID === sessionID
          )[pos]?.username
        );
        break;
      } else if (count === 9) {
        io.to(sessionID).emit("winnerfound", true);
        count = 0;
      }
    }
  });

  socket.on("disconnect", () => {
    const sessionID = playerUserNames[socket.id]?.sessionID;
    const userName = playerUserNames[socket.id]?.username;
    playerUserNames = Object.values(playerUserNames).filter(
      (player) => player.id !== socket.id
    );
    io.to(sessionID).emit("connectedUsers", false, userName);
  });
});

app.listen(PORT, (err) => {
  if (!err) {
    console.log("ok");
  } else {
    console.warn("bad");
  }
});

const express = require("express");
const app = express();
const PORT = 1234;
const io = require('socket.io')(3000,{
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
let usersCount = 0;
let playerUserNames = {};
let userNames
let timeoutId;
io.on('connection', (socket) => {
  if(usersCount >= 4){  
    socket.disconnect();
    console.log('too much users')
    return;
  }
  if(timeoutId){
    clearTimeout(timeoutId);
  }
  usersCount = usersCount + 1
  io.emit('connectedUsers',true,socket.id);
  


  
  socket.on("setUserName", (userName) => {
    playerUserNames[socket.id] = {
      username: userName,
      id:socket.id,
      isLocal: userNames ? (userNames.length % 2 === 0) : true,
    };
    userNames = Object.values(playerUserNames);
    if (userNames.length === 2) {
      io.emit("startGame", userNames);
    }
  });


  socket.on('disconnect', () => {
    usersCount = usersCount - 1
    userNames = null
    playerUserNames = {}
    io.emit('connectedUsers',false,socket.id);
    timeoutId = setTimeout(() => {
      io.emit('reloadPage');
    }, 4000); 
  });
});

app.listen(PORT, (err)=>{
  if(!err) {
    console.log('ok')
  }
  else{
    console.warn('bad')
  }
})



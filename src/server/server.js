const express = require("express")
const app = express();
const PORT = 1234;

const io = require('socket.io')(5174);

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('player_move', (data) => {
    console.log(`received player_move event from player ${data.player_id}`);
    // process player movement
    // update game state
    // broadcast game state to all players
    socket.broadcast.emit('game_state', { /* game state */ });
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
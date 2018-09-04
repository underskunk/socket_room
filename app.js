var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/test.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('pseudo', function(pseudo){
  	socket.pseudo = pseudo;
  });

  socket.on('room', function(room){
  	socket.leave(socket.room);
  	socket.room = room;  	
  	socket.join(room);
  });

  socket.on('message', function(msg){
	io.sockets.in(socket.room).emit('message', {pseudo: socket.pseudo, msg: msg});
   });



  /*socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('room', function(room) {
    socket.join(room);
  });
  socket.on('chat message', function(msg){
	room = "123";
	io.sockets.in(room).emit('message', msg);
   });*/
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/test.html');
});

app.get('/puissance4', function(req, res){
  res.sendFile(__dirname + '/puissance4.html');
});


var partie = {
	tab : new Array(),
	initTab : function () {
		for (var i = 0; i < 7; i++) {
			this.tab[i] = new Array()
			for (var j = 0; j < 6; j++) {
				this.tab[i][j] = 0;
			}
		}
	},
	joueur1 : '',
	joueur2 : '' 
}

partie.initTab();

io.on('connection', function(socket){
	socket.broadcast.emit('tab', partie.tab);
	socket.emit('tab', partie.tab);
	console.log(partie.tab);
	socket.on('disconnect', function(){
	console.log('user disconnected');
	});

	socket.on('joueur', function(pseudo, couleur){
		socket.pseudo = pseudo;
		socket.couleur = couleur;
	});

	socket.on('tab', function(tableau){
		partie.tab = tableau;
		socket.broadcast.emit('tab', partie.tab);
		socket.emit('tab', partie.tab);
		console.log(partie.tab);
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
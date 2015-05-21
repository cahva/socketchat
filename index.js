var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var people = {};

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){


  socket.on('join', function(name) {
    console.log(name + ' joined with socket id: ' + socket.id);
    people[socket.id] = {"name" : name};

  });

  socket.on('update', function(msg) {
    io.emit('chat message', msg);
  });

  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

  socket.on("typing", function(data) {
    if (typeof people[socket.id] !== "undefined")
      io.sockets.emit("isTyping", {isTyping: data, person: people[socket.id].name, sid: socket.id });
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
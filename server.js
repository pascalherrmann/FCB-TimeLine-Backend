var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongourl = "mongodb+srv://root:root@cluster0-ptocl.mongodb.net/test"
app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
    

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
    


io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
});






io.emit('some event', { for: 'everyone' });

// send message to everyone except 
io.on('connection', function(socket){
  socket.broadcast.emit('hi');
});



io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

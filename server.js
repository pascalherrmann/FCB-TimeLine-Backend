var express = require('express');
const util = require('util')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var mongourl = "mongodb+srv://root:root@cluster0-ptocl.mongodb.net/test"



/*
app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});
*/

app.use(express.static(__dirname + '/public'));

/*
Sample Code
*/

app.get('/test', function (req, res) {
    console.log("test");
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});

io.on('connection', function (socket) {
    console.log('a user connected');
    //todo: load last reactions
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});


io.on('connection', function (socket) {
    socket.on('chat message', function (msg) {
        console.log('message: ' + msg);
        console.log(util.inspect(msg, false, null))

        io.emit('chat message', msg);
    });
});



/*
MAIN
*/

//
// SENDING REACTION
//
// get a reaction and share it with everyone 
io.on('connection', function (socket) {
    socket.on('reaction', function (reaction) {
        
        //todo: save to DB
        console.log(util.inspect(reaction, false, null))
        io.emit('reaction', reaction);
    });
});


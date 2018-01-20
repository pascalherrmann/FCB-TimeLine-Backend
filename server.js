var express = require('express');
const fileUpload = require('express-fileupload');
const util = require('util')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);



var models = require('./models');
var dbManager = require('./dbManager');
var config = require('./config');

app.use(fileUpload());

/*
app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});
*/

app.use(express.static(__dirname + '/public'));

/*
Sample Code
*/

app.post('/test', function (req, res) {
     console.log("Reached");
		  if (!req.files.filename){
     console.log(req);
		console.log("broke");
    return res.status(400).send('No files were uploaded.');
	}
    console.log("gottem");
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.filename

  console.log(sampleFile);
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('./files/'+req.files.filename.name, function(err) {
    if (err)
	console.log(err);
      return res.status(500).send(err);

    res.send('File uploaded!');
});
})

http.listen(config.web.port, function () {
    console.log('listening on *:'+config.web.port);
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

        //save to DB
        var obj = new models.Reaction(reaction.name, reaction.message, reaction.imgpath)
        dbManager.insert(obj, "reactions");

        // send to others
        console.log(util.inspect(reaction, false, null))
        io.emit('reaction', reaction);
    });
});

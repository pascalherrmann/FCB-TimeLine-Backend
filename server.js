var express = require('express');
const util = require('util')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var models = require('./models');
var dbManager = require('./dbManager');
var config = require('./config');

var connected = 0;


var multer  = require('multer')

/*
app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});
*/

app.use(express.static(__dirname + '/public'));
var storage = multer.diskStorage({
	destination: function(req,file,callback){
		callback(null,"./files")
	},
	filename:function(req,file,callback){
			console.log(file.originalname)
			callback(null,String(file.originalname));
	}
});

/*
Sample Code
*/
var upload = multer({storage:storage}).single('filename');
app.post('/test', function (req, res) {
        console.log("reached");
        upload(req,res,function(err){
        if( err){
                console.log("BROKE!" + err);
                return res.end("err")
        }
        res.end("done");
  console.log("Uploaded");
})
})


app.get('/goal', function (req, res) {

    //
    const findDocuments = function (db, callback) {
        // Get the documents collection
        const collection = db.collection('documents');
        // Find some documents
        collection.find({
            timestamp: {
                $gt: req.timestamp + 120,
                $lt: req.timestamp - 20
            }
        }).toArray(function (err, docs) {
            assert.equal(err, null);
            res.send(docs);
        });
    }
});

http.listen(config.web.port, function () {
    console.log('listening on *:' + config.web.port);
});


io.on('connection', function (socket) {
    connected++;
    console.log('a user connected - ' + connected + " connected");
    //todo: load last reactions
    socket.on('disconnect', function () {
        connected--;
        console.log('user disconnected - ' + connected + "connected");
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


app.get('/reactions', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var resp = dbManager.get("reactions", function(r){
    res.send(JSON.stringify(r));
    });
    console.log(resp);
})


// todo: like-DB, get for all. delete

var express = require('express');
const fileUpload = require('express-fileupload');
const util = require('util')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);



var models = require('./models');
var dbManager = require('./dbManager');
var config = require('./config');

var connected = 0;


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
    if (!req.files.filename) {
        console.log("broke");
        return res.status(400).send('No files were uploaded.');
    }


    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.filename

    console.log(sampleFile);
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv('./files/' + req.files.filename.name, function (err) {
        if (err)
            console.log(err);
        return res.status(500).send(err);

        res.send('File uploaded!');
    });
});



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

// get previous reactions
app.get('/reactions', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var resp = dbManager.get("reactions", function (r) {
        res.send(JSON.stringify(r));
    });
})

// receive live reaction -> save it to db and share it with everyone 
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

//
// PIN
//

app.get('/pins', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var resp = dbManager.get("pins", function (r) {
        res.send(JSON.stringify(r));
    });
})


io.on('connection', function (socket) {
    socket.on('pin', function (pin) {

        //save to DB
        var obj = new models.Pin(pin.type, pin.matchID, pin.time, pin.scorer)
        dbManager.insert(obj, "pins");

        // send to others
        console.log(util.inspect(pin, false, null))
        io.emit('pin', pin);
    });
});


// todo: like-DB, get for all. delete
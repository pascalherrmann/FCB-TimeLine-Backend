var express = require('express');
const util = require('util')
const bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var models = require('./models');
var dbManager = require('./dbManager');
var config = require('./config');

var connected = 0;

var multer = require('multer')

/*
app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});
*/

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/files'));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./files")
    },
    filename: function (req, file, callback) {
        console.log(file.originalname)
        callback(null, String(file.originalname));
    }
});

/*
Sample Code
*/
var upload = multer({
    storage: storage
}).single('filename');
app.post('/test', function (req, res) {
    console.log("HELLOi " + req.params)
    console.log("reached");
    upload(req, res, function (err) {
        if (err) {
            console.log("BROKE!" + err);
            return res.end("err")
        }
        dbManager.insert({
            type: "1",
            pinID: req.headers.pinid,
            userID: '',
            text: '',
            mediaPath: req.file.filename
        }, "reactions")
        res.end("done");

        console.log("Uploaded");
    })
})

app.get('/video_urls', function (req, res) {
    console.log(req.query);
    var resp = dbManager.getFiltered({
        pinID: req.query.pinid
    }, "reactions", function (r) {
        res.send(JSON.stringify(r));
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

        var obj = new models.Reaction(reaction.type, reaction.pinID, reaction.userID, reaction.text, reaction.mediaPath)
        dbManager.insert(obj, "reactions");

        //todo: save to DB
        console.log(util.inspect(obj, false, null))
        io.emit('reaction', obj);
    });
});

//
// PIN
//
app.get('/pins', function (req, res) {
    console.log("RECEVIED PIN REQUEST");
    res.setHeader('Content-Type', 'application/json');
    var resp = dbManager.getMappedPins(function (r) {
        res.send(JSON.stringify(r));
    });
})

// hier alle Pins für ein Match
app.get('/pins/:matchID', function (req, res) {

    var matchID = req.params.matchID
    var filter = {"matchID":matchID}
    res.setHeader('Content-Type', 'application/json');
    var resp = dbManager.getFiltered(filter, "pins", function (r) {
        res.send(JSON.stringify(r));
    });
})

io.on('connection', function (socket) {
    socket.on('pin', function (pin) {

        //save to DB
        var obj = new models.Pin(pin.type, pin.matchID, pin.time, pin.scorer)
        dbManager.insert(obj, "pins");

        // send to others
        console.log(util.inspect(obj, false, null))
        io.emit('pins', obj);
    });
});

app.delete('/pins/:id', function (req, res) {
    dbManager.delete("pins", req.params.id)
    console.log(req.params.id)
    var resp = {
        "state": "success"
    }
    res.send(JSON.stringify(resp));
})

//
// Vote
//
io.on('connection', function (socket) {
    socket.on('vote', function (vote) {

        //save to DB
        var obj = new models.Vote(vote.type, vote.userID, vote.reactionID)
        dbManager.insert(obj, "votes");

        // send to others
        console.log(util.inspect(obj, false, null))
        io.emit('vote', obj);
    });
});

//
// Match
//
app.get('/matches', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var resp = dbManager.get("matches", function (r) {
        res.send(JSON.stringify(r));
    });
})

app.post('/matches', function (req, res) {
    console.log("hi")
    console.log(req.body.test);

    var obj = new models.Match(req.body.time, req.body.team1, req.body.team2)
    dbManager.insert(obj, "matches");

    res.send("thanks");
});

app.delete('/matches/:id', function (req, res) {
    dbManager.delete("matches", req.params.id)
    console.log(req.params.id)
    var resp = {
        "state": "success"
    }
    res.send(JSON.stringify(resp));

})


//get all pins for one match with all reactions

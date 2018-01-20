var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

var config = require('./config');

/*
MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.createCollection("reactions", function (err, res) {
        if (err) throw err;
        console.log("Collection created!");
        db.close();
    });
});
*/

// Test Connection
function connect() {
    MongoClient.connect(config.db.url, function (err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to database");
        db.close();
    });
}

module.exports = {
    
    insert: function (obj, collection) {
        MongoClient.connect(config.db.url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");

            dbo.collection(collection).insertOne(obj, function (err, res) {
                if (err) throw err;
                console.log("Saved Object to collection >" + collection);
                console.log(obj);
                db.close();
            });
        });
    },

    get: function(collection) {
        MongoClient.connect(config.db.url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            dbo.collection(collection).find({}).toArray(function (err, result) {
                if (err) throw err;
                console.log(result);
                db.close();
            });
        });
    }

};

connect();
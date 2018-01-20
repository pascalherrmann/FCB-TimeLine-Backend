var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

var config = require('./config');

var debug = false;

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

    get: function (collection, callback) {
        return MongoClient.connect(config.db.url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            return dbo.collection(collection).find({}).toArray(function (err, result) {
                if (err) throw err;
                if (debug) console.log(result);
                db.close();
                callback(result);
                return result;

            });
        });
    },

    getFiltered: function (filter, collection, callback) {
        return MongoClient.connect(config.db.url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            return dbo.collection(collection).find(filter).toArray(function (err, result) {
                if (err) throw err;
                if (debug) console.log(result);
                db.close();
                callback(result);
                return result;

            });
        });
    }


};

connect();

/*


function test(collection, callback) {
    MongoClient.connect(config.db.url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");

        return dbo.collection(collection).find({
            group: "Muse"
        }).exec().then(function (users) {
            return bluebird.map(users, function (user) {
                return Items.find({
                    user_id: user._id
                }).exec().then(function (items) {
                    user.items = items;
                    return user;
                });
            }, {
                concurrency: 5
            });
        }).then(function (users) {
            // do something with users
        }).catch(function (err) {
            // do something with errors from either find
        });


    });
}
*/

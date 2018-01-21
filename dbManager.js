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

    delete: function (collection, id) {
        MongoClient.connect(config.db.url, function (err, db) {

            var ObjectId = require('mongodb').ObjectID;

            if (err) throw err;
            var dbo = db.db("mydb");
            var myquery = {
                _id: ObjectId(id)
            };
            dbo.collection(collection).deleteOne(myquery, function (err, obj) {
                if (err) throw err;
                console.log("deleted id=" + id + " from collection " + collection);
                db.close();
            });
        });
    },

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
    },

    getMappedPins: function (callback) {
        return MongoClient.connect(config.db.url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");

            return dbo.collection("pins").find({}).toArray(function (err, pins) {
                if (err) throw err;
                if (debug) console.log(pins);



                var pinIDs = pins.map(function (pin) {
                    return "" + pin._id;
                });

                dbo.collection("reactions").find({
                    pinID: {
                        $in: pinIDs
                    }
                }).toArray(function (err, reactions) {
                    db.close();

                    pins.forEach(function (pin) {
                        pin.items = reactions.filter(function (r) {
                            return r.pinID == pin._id;
                        }).length;
                    });

                    callback(pins);

                    return
                })

                return pins;
            })
        })
    }


};

connect();

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var url = "mongodb+srv://root:root@cluster0-ptocl.mongodb.net/test"
function connect(){
	MongoClient.connect(url, function(err, db) {
 		 assert.equal(null, err);
 		 console.log("Connected successfully to server");

		  db.close();
	});
}
function saveData(json_val){
  var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('reactions');
  // Insert some documents
  collection.insert({
    json_val
  }, function(err, result) {
    callback(result);
  });
}
	return "data inserted";
}
function getData(gameid){
var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('reactions');
  // Find some documents
  collection.find({gameid:gameid}).toArray(function(err, docs) {
    assert.equal(err, null);
	return docs;
  });
}
}

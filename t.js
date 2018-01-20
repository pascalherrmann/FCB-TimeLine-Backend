var dbManager = require('./dbManager');
var resp = dbManager.get("reactions");
console.log(resp);
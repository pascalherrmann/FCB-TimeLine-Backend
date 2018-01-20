var config = {};

config.db = {};
config.db.url = "mongodb://localhost:27017/";
config.web = {};
config.web.port = process.env.WEB_PORT || 3000;

module.exports = config;
var config = {};

config.twitter = {};
config.redis = {};
config.web = {};
config.web.port = process.env.WEB_PORT || 3000;

module.exports = config;
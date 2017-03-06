var MongoClient = require('mongodb').MongoClient;

function createMongoUrl() {
    var url = 'mongodb://';
    // This uses the config file directly, as the conf module can't be
    // initialized fully until a DB connection is established.
    var conf = require('../config').mongoConfig;

    // username and password can be omitted in non-production scenarios.
    if (conf.user !== undefined) {
        url = url + conf.user;

        if (conf.password !== undefined) {
            url = url + ':' + conf.password;
        }

        url = url + '@';
    }

    url = url + conf.host;

    // port can be omitted
    if (conf.port !== undefined) {
        url = url + ':' + conf.port;
    }

    url = url + '/' + conf.db;

    return url;
}

module.exports.init = function(callback) {
    MongoClient.connect(createMongoUrl(), function(err, db) {
        if (err) {
            console.error('Getting mongodb connection failed: ' + err);
        }

        module.exports.db = db;

        callback(err);
    });
};

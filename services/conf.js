var _ = require('underscore');
var db = require('./db').db;
var confCollection = db.collection('config');

module.exports = {
    initializeConfig : function(callback) {
        var self = this;

        // clear stored configuration
        module.exports.config = {};

        // clear cached fileConfig
        delete require.cache[require.resolve('../config')];

        // reload file config
        var fileConfig = require('../config');

        // Load all configuration from db
        var dbConfig = {};
        confCollection.find({}).forEach(function(configuration) {
            if (configuration.key === undefined) {
                console.log('Invalid configuration not loaded: ', configuration);
            }
            else if (configuration.value === undefined) {
                dbConfig[configuration.key] = true;
            }
            else {
                dbConfig[configuration.key] = configuration.value;
            }
        },
        function(err) {
            if (err !== null && err !== undefined) {
                console.log('failed to load configuration!', err);

                return;
            }

            module.exports.config = _.extend(dbConfig, fileConfig);

            console.log('Configuration reloaded!');

            if (typeof callback === 'function') {
                callback();
            }
        });
    }
};

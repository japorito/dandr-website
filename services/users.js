var db = require('./db').db;
var users = db.collection('users');

module.exports = {
    findUserByProviderId: function(id, provider, callback) {
        users.findOne({providerId: id, provider: provider}, callback);
    },

    findUserByUserObject: function(user, callback) {
        var emailList = [];

        for (var i=0; i<user.emails.length; i++) {
            var email = user.emails[i];
            emailList.push(email.value);
        }

        var userQuery = {provider: user.provider, email: {$in: emailList}};

        users.findOne(userQuery, function(err, dbUser) {
            if (dbUser !== null &&
                user.id !== dbUser.providerId)
            {
                //new or changed user
                console.log('Updating user on login: ', user);

                users.updateOne(userQuery, {
                    $set: {
                        displayName : user.displayName,
                        providerId : user.id,
                        provider : user.provider
                    }
                });
            }

            callback(err, dbUser);
        });
    },

    insertUser: function(user, callback) {
        users.insertOne(user, callback);
    },

    updateRoles: function(id, provider, roles, callback) {
        users.updateOne({providerId : id, provider: provider}, {
            $set: {
                roles : roles
            }
        }, callback);
    }
};

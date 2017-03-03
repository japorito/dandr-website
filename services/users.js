var db = require('./db').db;
var users = db.collection('users');

module.exports = {
    findUserByGoogleID: function(id, callback) {
        users.findOne({googleId: id}, callback);
    },

    findUserByGoogleUserObject: function(user, callback) {
        var emailList = [];

        for (var i=0; i<user.emails.length; i++) {
            var email = user.emails[i];
            emailList.push(email.value);
        }

        var userQuery = {email: {$in: emailList}};

        users.findOne(userQuery, function(err, dbUser) {
            if (dbUser !== null &&
                user.id !== dbUser.googleId)
            {
                //new or changed user
                console.log('Updating user on login: ', user);

                users.updateOne(userQuery, {
                    $set: {
                        displayName : user.displayName,
                        googleId : user.id
                    }
                });
            }

            callback(err, dbUser);
        });
    },

    insertUser: function(user, callback) {
        users.insertOne(user, callback);
    },

    updateRoles: function(id, roles, callback) {
        users.updateOne({googleId : id}, {
            $set: {
                roles : roles
            }
        }, callback);
    }
};

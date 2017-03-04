var _ = require('underscore');
var config = require('../config');

function authorizePermission(user, permission) {
    return user !== null &&
           user !== undefined &&
           user.providerId !== '-1' &&
           (config.authorization[permission] === undefined ||
           _.intersection(config.authorization[permission], user.roles).length > 0);
}

module.exports = {
    handlebarsHelper : function(permission, options) {
        if (authorizePermission(this.user, permission)) {
            return options.fn(this);
        }
        else {
            return '';
        }
    },
    middleware : function(req, res, next) {
        var matchingPermissions = [];

        for(var path in config.pathPermissions) {
            if (req.path.match(new RegExp(path))) {
                matchingPermissions.push(config.pathPermissions[path]);
            }
        }

        //Redirect to login if not logged in and it matched a protected path
        if (matchingPermissions.length > 0 && req.user === undefined) {
            res.redirect(config.googleCredentials.callbackURL);
        }

        for (var i=0; i<matchingPermissions.length; i++)
        {
            var permissionSet = matchingPermissions[i];
            var authorized = false;

            for (var j=0; j<permissionSet.length; j++) {
                var permission = permissionSet[j];

                if (authorizePermission(req.user, permission)) {
                    authorized = true;
                    break;
                }
            }

            if (!authorized) {
                res.redirect('/denied');
            }
        }

        next();
    }
};

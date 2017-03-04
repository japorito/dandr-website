module.exports = {
    sitename: 'Your Site Name',
    sessionLength : 3600000, //1 hour
    secureCookies : true, //Requires HTTPS. Set to false if not available, not recommended for production.
    sessionSecret : 'correct horse battery staple',
    production : true,
    port : 443, //HTTPS default
    memcacheConfig : {
        hosts  : ['127.0.0.1:11211'],
        prefix : 'dandr'
    },
    googleCredentials : {
        clientID: 'Google Client ID',
        clientSecret: 'Google OAuth Secret',
        callbackURL: '/login'
    },
    mongoConfig : {
        username : 'mongo',
        password : 'password',
        host : '127.0.0.1',
        port : '27017',
        db : 'dandr'
    },
    // permission name : array of authorized roles
    authorization : {
        'manage-users' : ['sysadmin', 'siteadmin'],
        'site-administration' : ['sysadmin', 'siteadmin', 'contentcreator']
    },
    // path regex : array of permissions to check (at least one must pass)
    pathPermissions : {
        '^/admin*': ['site-administration'],
        '^/admin/users': ['manage-users']
    }
};

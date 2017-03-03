var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var MemcachedStore = require('connect-memcached')(session);

var index = require('./routes/index');
var admin = require('./routes/admin');

var config = require('./config');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(config.sessionSecret));
app.use(session({
    secret : config.sessionSecret,
    store  : new MemcachedStore(config.memcacheConfig),
    resave            : false,
    saveUninitialized : false,
    cookie            : {
        maxAge : config.sessionLength, //1 hour
        config : config.secureCookies
    }
}));
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

/* Set up Auth Code */
passport.use(new GoogleStrategy(config.googleCredentials,
  function(accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
  }
));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
passport.serializeUser(function(user, callback) {
    var users = require('./services/users');

    users.findUserByGoogleUserObject(user, function(err, dbUser) {
        callback(err, user.id);
    });
});

passport.deserializeUser(function(id, callback) {
    var users = require('./services/users');

    users.findUserByGoogleID(id, function(err, user) {
        callback(err, user);
    });
});

app.use(passport.initialize());
app.use(passport.session());
app.use(config.googleCredentials.callbackURL,
        passport.authenticate('google', {
          'scope' : ['email'],
          'failureRedirect' : '/denied',
          'successReturnToOrRedirect' : '/admin'
        })
    );

app.use('/', index);
app.use('/admin',
        ensureLoggedIn(config.googleCredentials.callbackURL),
        admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = !config.production ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

var http = require("http");
var https = require("https");
var cookieSession = require('cookie-session');
var express = require("express");
var passport = require("passport");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
import { TokenCacheService } from './services/tokenCacheService';

var fs = require("fs");
var url = require("url");
var querystring = require("querystring");
var dbContext_1 = require("./data/dbContext");
var config = require('./config');

var meRoute = require("./routes/me");
var usersRoute = require("./routes/users");
var registerRoute = require("./routes/register");
var schoolsRoute = require("./routes/schools");
var linkRoute = require("./routes/link");
var localauthRoute = require("./routes/localauth");


var app = express();

// Angular 2
app.use("/app", express.static(path.join(__dirname, 'app')));
app.use("/dist", express.static(path.join(__dirname, 'dist')));
app.use("/node_modules", express.static(path.join(__dirname, 'node_modules'), { maxAge: 1000 * 60 * 60 * 24 }));
app.use("/fonts", express.static(path.join(__dirname, 'app/fonts'), { maxAge: 1000 * 60 * 60 * 24 }));
app.get("/styles.css", function (req, res) {
    res.sendfile(path.join(__dirname, 'styles.css'));
});
app.get("/systemjs.config.js", function (req, res) {
    res.sendfile(path.join(__dirname, 'systemjs.config.js'));
});

// Start QuickStart here
var OIDCStrategy = require('./node_modules/passport-azure-ad/lib/index').OIDCStrategy;
var windowsGraphResourceUrl = 'https://graph.microsoft.com';
var AADGraphResourceUrl = 'https://graph.windows.net';
var tokenCache = new TokenCacheService();
/******************************************************************************
 * Set up passport in the app
 ******************************************************************************/
//-----------------------------------------------------------------------------
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session.  Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing.
//-----------------------------------------------------------------------------
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});
// array to hold logged in users

var getQueryString = function (field, href) {
    var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
    var string = reg.exec(href);
    return string ? string[1] : null;
};
//-----------------------------------------------------------------------------
// Use the OIDCStrategy within Passport.
// 
// Strategies in passport require a `verify` function, which accepts credentials
// (in this case, the `oid` claim in id_token), and invoke a callback to find
// the corresponding user object.
// 
// The following are the accepted prototypes for the `verify` function
// (1) function(iss, sub, done)
// (2) function(iss, sub, profile, done)
// (3) function(iss, sub, profile, access_token, refresh_token, done)
// (4) function(iss, sub, profile, access_token, refresh_token, params, done)
// (5) function(iss, sub, profile, jwtClaims, access_token, refresh_token, params, done)
// (6) prototype (1)-(5) with an additional `req` parameter as the first parameter
//
// To do prototype (6), passReqToCallback must be set to true in the config.
//-----------------------------------------------------------------------------
passport.use(new OIDCStrategy({
    identityMetadata: config.creds.identityMetadata,
    clientID: config.creds.clientID,
    responseType: config.creds.responseType,
    responseMode: config.creds.responseMode,
    redirectUrl: app.get('env') === 'development' ? 'https://localhost:44380' + config.creds.redirectUrl : 'https://edugraphapi2dev.azurewebsites.net' + config.creds.redirectUrl,
    allowHttpForRedirectUrl: config.creds.allowHttpForRedirectUrl,
    clientSecret: config.creds.clientSecret,
    validateIssuer: config.creds.validateIssuer,
    isB2C: config.creds.isB2C,
    issuer: config.creds.issuer,
    passReqToCallback: config.creds.passReqToCallback,
    scope: config.creds.scope,
    loggingLevel: config.creds.loggingLevel,
    nonceLifetime: config.creds.nonceLifetime,
}, function (req, iss, sub, profile, jwtClaims, access_token, refresh_token, params, done) {
    if (!profile.oid) {
        return done(new Error("No oid found"), null);
    }
    profile.authType = 'O365';
    req.res.cookie('authType', 'O365');

    if (params.resource.toLowerCase() == windowsGraphResourceUrl.toLowerCase()) {
        tokenCache.updateMSGToken(profile.oid, access_token, refresh_token, params.expires_on * 1000);
    }
    if (params.resource.toLowerCase() == AADGraphResourceUrl.toLowerCase()) {
        tokenCache.updateAADGToken(profile.oid, access_token, refresh_token, params.expires_on * 1000);
    }
    // asynchronous verification, for effect...
    process.nextTick(function () {
        return done(null, profile);
    });
}));
//-----------------------------------------------------------------------------
// Config the app, include middlewares
//-----------------------------------------------------------------------------

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
//app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: false }));
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
// APIs
app.use('/api/me', ensureAuthenticated, meRoute);
app.use('/api/users', ensureAuthenticated, usersRoute);
app.use('/api/register', registerRoute);
app.use('/api/schools', ensureAuthenticated, schoolsRoute);
app.use('/api/link', ensureAuthenticated, linkRoute);

//-----------------------------------------------------------------------------
// Set up the route controller
//
// 1. For 'login' route and 'returnURL' route, use `passport.authenticate`. 
// This way the passport middleware can redirect the user to login page, receive
// id_token etc from returnURL.
//
// 2. For the routes you want to check if user is already logged in, use 
// `ensureAuthenticated`. It checks if there is an user stored in session, if not
// it will call `passport.authenticate` to ask for user to log in.
//-----------------------------------------------------------------------------
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else if (req.baseUrl.startsWith("/api/")) {
        res.send(401, 'missing authorization header');
    }
    res.redirect('/');
}

var option_windowsGraph = {
    resourceURL: windowsGraphResourceUrl,
    customState: 'my_state',
    failureRedirect: '/'
}, option_AAdGraph = {
    resourceURL: AADGraphResourceUrl,
    customState: 'my_state',
    failureRedirect: '/'
};
app.get('/o365login', function (req, res) {
    req.session.authtokentype = 'aadgraph';
    res.redirect('/o365login/aadgraph');
});
app.get('/o365login/aadgraph', passport.authenticate('azuread-openidconnect', option_AAdGraph));
app.get('/o365login/windowsgraph', passport.authenticate('azuread-openidconnect', option_windowsGraph));
// 'GET returnURL'
// `passport.authenticate` will try to authenticate the content returned in
// query (such as authorization code). If authentication fails, user will be
// redirected to '/' (home page); otherwise, it passes to the next middleware.
app.get('/auth/openid/return', passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }), function (req, res) {
    res.redirect('/');
});
// 'POST returnURL'
// `passport.authenticate` will try to authenticate the content returned in
// body (such as authorization code). If authentication fails, user will be
// redirected to '/' (home page); otherwise, it passes to the next middleware.
app.post('/auth/openid/return', passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }), function (req, res) {
    if (req.session.authtokentype == 'aadgraph') {
        req.session.authtokentype = null;
        res.redirect('/o365login/windowsgraph');
    }
    else {
        res.redirect('/');
    }
});
// 'logout' route, logout from passport, and destroy the session with AAD.
app.get('/logout', function (req, res) {
    res.clearCookie('authType');
    req.logOut();
    req.session = null;
    res.redirect(config.destroySessionUrl + req.protocol + '://' + req.get('host'));
});
// 'Local auth' route
app.post('/account/login', localauthRoute);

//web api for get access token
app.get('/api/getaccesstoken', function (req, res) {
    if (req.isAuthenticated()) {
        let oid = req.user.oid;
        switch (req.query["resource"]) {
            case windowsGraphResourceUrl:
                tokenCache.getMSAccessToken(oid)
                    .then((result) => {
                        res.json(result);
                    });
                break;
            case AADGraphResourceUrl:
                tokenCache.getAADAccessToken(oid)
                    .then((result) => {
                        res.json(result);
                    });
                break;
            default:
                res.json({ error: "resource is invalid" });
                break;
        }
    }
    else {
        res.json({ error: "401 unauthorized" });
    }
});

var indexPage = app.get('env') === 'development' ? 'index.html' : 'index.prod.html';
app.get('/*', function (req, res) {
    res.sendfile(path.join(__dirname, indexPage));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err['status'] || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
// database
var db = new dbContext_1.DbContext();
db.sync({ force: false }).then(function () { });
//
var port = process.env.port || 1337;
if (app.get('env') === 'development') {
    https.createServer({
        key: fs.readFileSync('ssl/key.pem'),
        cert: fs.readFileSync('ssl/cert.pem')
    }, app).listen(port);
}
else {
    http.createServer(app).listen(port, function () {
        console.log('Express server listening on port ' + port);
    });
}
//# sourceMappingURL=app - Copy.js.map
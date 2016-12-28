var https = require("https");
var express = require("express");
var expressSession = require("express-session");
var passport = require("passport");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var azureADAuthSrv= require('./services/azureADAuthService');

var fs = require("fs");
var url = require("url");
var querystring = require("querystring");
var dbContext_1 = require("./data/dbContext");
var config = require('./config');

var meRoute = require("./routes/me");
var usersRoute = require("./routes/users");
var schoolsRoute = require("./routes/schools");

// Start QuickStart here
var OIDCStrategy = require('./node_modules/passport-azure-ad/lib/index').OIDCStrategy;
var windowsGraphResourceUrl = 'https://graph.microsoft.com';
var AADGraphResourceUrl = 'https://graph.windows.net';
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
    done(null, user['oid']);
});
passport.deserializeUser(function (oid, done) {
    findByOid(oid, function (err, user) {
        done(err, user);
    });
});
// array to hold logged in users
var users = [];
var cacheToken = {};
var findByOid = function (oid, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
        var user = users[i];
        if (user.oid === oid) {
            return fn(null, user);
        }
    }
    return fn(null, null);
};
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
    redirectUrl: config.creds.redirectUrl,
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
    var resource = getQueryString('resource', querystring.unescape(url.parse(req.headers.referer).query));
    if (cacheToken[profile.oid] == null)
        cacheToken[profile.oid] = {};
    if (resource == windowsGraphResourceUrl) {
        cacheToken[profile.oid]['windowsgraph.accesstoken'] = access_token;
        cacheToken[profile.oid]['windowsgraph.refreshToken'] = refresh_token;
        cacheToken[profile.oid]['windowsgraph.expires'] = params.expires_on * 1000;
    }
    if (resource == AADGraphResourceUrl) {
        cacheToken[profile.oid]['aadgraph.accesstoken'] = access_token;
        cacheToken[profile.oid]['aadgraph.refreshToken'] = refresh_token;
        cacheToken[profile.oid]['aadgraph.expires'] = params.expires_on * 1000;
    }
    // asynchronous verification, for effect...
    process.nextTick(function () {
        findByOid(profile.oid, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                // "Auto-registration"
                users.push(profile);
                return done(null, profile);
            }
            return done(null, user);
        });
    });
}));
//-----------------------------------------------------------------------------
// Config the app, include middlewares
//-----------------------------------------------------------------------------
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: false }));
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
app.use('/api/me', meRoute);
app.use('/api/users', usersRoute);
app.use('/api/schools', schoolsRoute);
//app.post('/api/authenticate/:action', authenticate);
// Angular 2
app.use("/app", express.static(path.join(__dirname, 'app')));
app.use("/node_modules", express.static(path.join(__dirname, 'node_modules')));
app.get("/styles.css", function (req, res) {
    res.sendfile(path.join(__dirname, 'styles.css'));
});
app.get("/systemjs.config.js", function (req, res) {
    res.sendfile(path.join(__dirname, 'systemjs.config.js'));
});
//app.use("/api/users", localusers);
//app.all("/*", (req, res) => {
//    res.sendfile(path.join(__dirname, 'index.html'));
//});
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
    res.redirect('/');
}

// '/account' is only available to logged in user
app.get('/account', ensureAuthenticated, function (req, res) {
    res.render('account', { user: req.user });
});
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
    res.redirect('/o365login/aadgraph');
});
app.get('/o365login/aadgraph', passport.authenticate('azuread-openidconnect', option_AAdGraph), function (req, res) {
    res.redirect('/o365login/windowsgraph');
});
app.get('/o365login/windowsgraph', passport.authenticate('azuread-openidconnect', option_windowsGraph), function (req, res) {
    res.redirect('/');
});
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
    var resource = getQueryString('resource', querystring.unescape(url.parse(req.headers['referer']).query));
    if (resource == AADGraphResourceUrl) {
        res.redirect('/o365login/windowsgraph');
    }
    if (resource == windowsGraphResourceUrl) {
        //res.cookie('user_token', cacheToken[req.user.oid]['aadgraph.accesstoken']);
        //res.cookie('ms_user_token', cacheToken[req.user.oid]['windowsgraph.accesstoken']);
        res.redirect('/');
    }
});
// 'logout' route, logout from passport, and destroy the session with AAD.
app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        req.logOut();
        res.redirect(config.destroySessionUrl);
    });
});

//web api for get access token
app.get('/api/getaccesstoken', function (req, res) {
    if (req.isAuthenticated()) {
        switch (req.query["resource"]) {
            case windowsGraphResourceUrl:
                if ((new Date()).getTime() < cacheToken[req.user.oid]['windowsgraph.expires']) {
                    res.json({
                        accesstoken: cacheToken[req.user.oid]['windowsgraph.accesstoken'],
                        expires: cacheToken[req.user.oid]['aadgraph.expires']
                    });
                }
                else {
                    azureADAuthSrv.getAccessToeknViaRefreshToken(cacheToken[req.user.oid]['windowsgraph.refreshToken']).then((result) => {
                        cacheToken[req.user.oid]['windowsgraph.accesstoken'] = result.access_token;
                        cacheToken[req.user.oid]['windowsgraph.expires'] = result.expires_on * 1000;
                        res.json({
                            accesstoken: result.access_token,
                            expires: cacheToken[req.user.oid]['aadgraph.expires']
                        });
                    });
                }
                break;
            case AADGraphResourceUrl:
                if ((new Date()).getTime() < cacheToken[req.user.oid]['aadgraph.expires'] /*TODO: Theo - 5min*/) {
                    res.json({
                        accesstoken: cacheToken[req.user.oid]['aadgraph.accesstoken'],
                        expires: cacheToken[req.user.oid]['aadgraph.expires']
                    });
                }
                else {
                    azureADAuthSrv.getAccessToeknViaRefreshToken(cacheToken[req.user.oid]['aadgraph.refreshToken']).then((result) => {
                        cacheToken[req.user.oid]['aadgraph.accesstoken'] = result.access_token;
                        cacheToken[req.user.oid]['aadgraph.expires'] = result.expires_on * 1000;
                        res.json({
                            accesstoken: result.access_token,
                            expires: cacheToken[req.user.oid]['aadgraph.expires']
                        });
                    });
                }
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

app.get('/*', function (req, res) {
    //res.render('index', { user: req.user });
    res.sendfile(path.join(__dirname, 'index.html'));
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
//http.createServer(app).listen(port, function () {
//    console.log('Express server listening on port ' + port);
//});
https.createServer({
    key: fs.readFileSync('ssl/key.pem'),
    cert: fs.readFileSync('ssl/cert.pem')
}, app).listen(port);
//# sourceMappingURL=app - Copy.js.map
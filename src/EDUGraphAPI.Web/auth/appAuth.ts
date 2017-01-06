var express = require("express");
var passport = require("passport");
import * as Promise from "bluebird";
import https = require('https');
import querystring = require('querystring');
import { TokenCacheService } from '../services/tokenCacheService';
import { Constants } from '../constants';
import { UserService } from '../services/userService';
var tokenCache = new TokenCacheService();

export class appAuth {
    private app: any = null;

    //AAD authentication strategy
    private OIDCStrategy = require('../node_modules/passport-azure-ad/lib/index').OIDCStrategy;

    //Local authentication strategy
    private LocalStrategy = require('passport-local').Strategy;

    /******************************************************************************
    * Set up passport in the app
    ******************************************************************************/
    //-----------------------------------------------------------------------------
    // To support persistent login sessions, Passport needs to be able to
    // serialize users into and deserialize users out of the session.  Typically,
    // this will be as simple as storing the user ID when serializing, and finding
    // the user by ID when deserializing.
    //-----------------------------------------------------------------------------
    constructor(app: any) {
        this.app = app;

        passport.serializeUser(function (user, done) {
            done(null, user);
        });

        passport.deserializeUser(function (user, done) {
            done(null, user);
        });

        passport.use('azuread-openidconnect', this.constructOIDCStrategy());

        passport.use('localStrategy', this.constructLocalStrategy());
    }

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
    constructOIDCStrategy() {
        return new this.OIDCStrategy({
            identityMetadata: Constants.IdentityMetadata,
            clientID: Constants.ClientId,
            responseType: Constants.ResponseType,
            responseMode: Constants.ResponseMode,
            redirectUrl: this.app.get('env') === 'development'
                ? 'https://localhost:44380' + Constants.RedirectUrl
                : 'https://' + Constants.Host + Constants.RedirectUrl,
            allowHttpForRedirectUrl: Constants.AllowHttpForRedirectUrl,
            clientSecret: Constants.ClientSecret,
            validateIssuer: Constants.ValidateIssuer,
            isB2C: false,
            passReqToCallback: Constants.PassReqToCallback,
            loggingLevel: Constants.LoggingLevel,
            nonceLifetime: Constants.NonceLifetime,
        }, function (req, iss, sub, profile, jwtClaims, access_token, refresh_token, params, done) {
            if (!profile.oid) {
                return done(new Error("No oid found"), null);
            }
            profile.authType = 'O365';
            req.res.cookie('authType', 'O365');

            if (params.resource.toLowerCase() == Constants.MSGraphResource.toLowerCase()) {
                tokenCache.updateMSGToken(profile.oid, access_token, refresh_token, params.expires_on * 1000);
            }
            if (params.resource.toLowerCase() == Constants.AADGraphResource.toLowerCase()) {
                tokenCache.updateAADGToken(profile.oid, access_token, refresh_token, params.expires_on * 1000);
            }
            // asynchronous verification, for effect...
            process.nextTick(function () {
                return done(null, profile);
            });
        });
    }

    //-----------------------------------------------------------------------------
    // Use the LocalStrategy within Passport.
    //-----------------------------------------------------------------------------
    constructLocalStrategy() {
        return new this.LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password'
            },
            function (username, password, done) {
                let userSrv = new UserService();
                userSrv.validUser(username, password)
                    .then((user) => {
                        if (user) {
                            done(null, {
                                'id': user['id'],
                                'oid': user['o365UserId'],
                                'authType': "Local"
                            });
                        } else {
                            done(null);
                        }
                    })
                    .catch(err => {
                        done(null);
                    });
            });
    }

    ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        else if (req.baseUrl.startsWith("/api/")) {
            res.send(401, 'missing authorization header');
        }
        res.redirect('/');
    }

    // Initialize Passport!  Also use passport.session() middleware, to support
    // persistent login sessions (recommended).
    public initPassport(app: any) {
        app.use(passport.initialize());
        app.use(passport.session());
    }

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
    public initAuthRoute(app: any) {
        app.get('/o365login', function (req, res) {
            req.session.authtokentype = 'aadgraph';
            res.redirect('/o365login/aadgraph');
        });

        app.get('/o365login/aadgraph', passport.authenticate('azuread-openidconnect', {
            resourceURL: Constants.AADGraphResource,
            customState: 'my_state',
            failureRedirect: '/'
        }));

        app.get('/o365login/windowsgraph', passport.authenticate('azuread-openidconnect', {
            resourceURL: Constants.MSGraphResource,
            customState: 'my_state',
            failureRedirect: '/'
        }));

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
            let authType = req.cookies['authType'];
            res.clearCookie('authType');
            req.logOut();
            req.session = null;
            if (authType == 'O365')
                res.redirect(Constants.DestroySessionUrl + req.protocol + '://' + req.get('host'));
            else
                res.redirect('/');
        });

        app.post('/account/login', passport.authenticate('localStrategy'),
            function (req, res) {
                res.cookie('authType', 'Local');
                res.json({ status: 'validate successfully' });
            });
    }
}

export function getAccessTokenViaRefreshToken(refreshToken: string): Promise<string> {
    return new Promise<any>((resolve, reject) => {
        var postData = querystring.stringify({
            refresh_token: refreshToken,
            client_id: Constants.ClientId,
            client_secret: Constants.ClientSecret,
            grant_type: "refresh_token"
        });

        var options = {
            hostname: 'login.microsoftonline.com',
            port: 443,
            path: '/common/oauth2/token',
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length
            }
        };

        var req = https.request(options, function (res) {
            var result = '';
            res.on('data', function (chunk) {
                result += chunk;
            });
            res.on('end', function () {
                resolve(JSON.parse(result));
            });
            res.on('error', function (err) {
                reject(err);
            })
        });

        // req error
        req.on('error', function (err) {
            reject(err);
        });

        //send request witht the postData form
        req.write(postData);
        req.end();
    });
}

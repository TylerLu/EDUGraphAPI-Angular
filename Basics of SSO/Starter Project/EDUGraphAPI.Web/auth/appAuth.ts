/*
* Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
* See LICENSE in the project root for license information.
*/
var express = require("express");
var passport = require("passport");
import https = require('https');
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


        passport.use('Local', this.constructLocalStrategy());
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
                            let organization = user['organization'];
                            done(null, {
                                'id': user['id'],
                                'oid': user['o365UserId'],
                                'tid': organization ? organization.tenantId : '',
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

        app.post('/auth/login/local', passport.authenticate('Local'),
            function (req, res) {
                if (req.body.remember) {
                    res.cookie('authType', 'Local', { maxAge: 30 * 24 * 60 * 60 * 1000 });
                } else {
                    res.cookie('authType', 'Local');
                }
                res.json({ status: 'validate successfully' });
            });


        // 'GET returnURL'
        // `passport.authenticate` will try to authenticate the content returned in
        // query (such as authorization code). If authentication fails, user will be
        // redirected to '/' (home page); otherwise, it passes to the next middleware.
        app.get('/auth/openid/return', passport.authenticate('O365', { failureRedirect: '/' }), function (req, res) {
            res.redirect('/');
        });

        // 'POST returnURL'
        // `passport.authenticate` will try to authenticate the content returned in
        // body (such as authorization code). If authentication fails, user will be
        // redirected to '/' (home page); otherwise, it passes to the next middleware.
        app.post('/auth/openid/return', passport.authenticate('O365', { failureRedirect: '/' }), function (req, res) {
            res.redirect('/');
        });

        // 'logout' route, logout from passport, and destroy the session with AAD.
        app.get('/logout', function (req, res) {
            let authType = req.cookies['authType'];
            res.clearCookie('authType');
            req.logOut();
            req.session = null;
            res.redirect('/');
        });
    }
}
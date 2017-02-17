/*
* Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
* See LICENSE in the project root for license information.
*/
import express = require('express');
import jwt = require('jsonwebtoken');
import { UserService } from '../services/userService';
import { Constants } from '../constants';
import { TokenCacheService } from '../services/TokenCacheService';
import { TokenUtils } from '../utils/tokenUtils'

var router = express.Router();
var userService = new UserService();

router.post('/LocalUser', function (req, res) {
    var u = req.user;
    if (u.authType == 'O365') {
        var localUser = req.body;
        userService.linkLocalUser(u, localUser.email, localUser.password)
            .then(() => res.json(200))
            .catch(error => res.json(500, { error: error }))
    }
    else {
        res.json(500, { error: "Invalid login attempt." });
    }
});

router.post('/LocalMatchingUser', function (req, res) {
    var u = req.user;
    if (u.authType == 'O365') {
        userService.linkMatchingLocalUser(u)
            .then(() => res.json(200))
            .catch(error => res.json(500, { error: error }))
    }
    else {
        res.json(500, { error: "Invalid login attempt." });
    }
});

router.post('/CreateLocalUser', function (req, res) {
    var u = req.user;
    if (u.authType == 'O365') {
        var localUser = req.body;
        userService.linkCreateLocalUser(u, localUser.favoriteColor)
            .then(() => res.json(200))
            .catch(error => res.json(500, { error: error }))
    }
    else {
        res.json(500, { error: "Invalid login attempt." });
    }
});

router.post('/O365User', function (req, res) {
    var redirectUrl = req.query.redirectUrl || '/schools';
    var idToken = jwt.decode(req.body.id_token);
    var tentantId = idToken.tid;
    var code = req.body.code;

    let accessToken: string;
    let tokenService = new TokenCacheService();
    var localUser = req.user;
    localUser.oid = idToken.oid;
    localUser.tid = tentantId;

    TokenUtils.getTokenByCode(code, tentantId, Constants.MSGraphResource,'api/link/O365User')
        .then(msToken => {
            return tokenService.updateMSGToken(idToken.oid, msToken.access_token, msToken.refresh_token, msToken.expires_on * 1000);
        })
        .then(tokenObject => {
            accessToken = tokenObject.msgAccessToken;
            return TokenUtils.getTokenByRefreshToken(tokenObject.msgRefreshgToken, Constants.AADGraphResource)
        })
        .then(aadToken => {
            return tokenService.updateAADGToken(idToken.oid, aadToken.access_token, aadToken.refresh_token, aadToken.expires_on * 1000);
        })
        .then(tokenObject => {
            return userService.linkO365User(accessToken, idToken.oid, idToken.upn, localUser.id, tentantId)
        })
        .then(() => {
            res.redirect(redirectUrl);
        })
        .catch(error => {
            let errorMsg: String = '';
            if (typeof error == 'string' || error instanceof String) {
                errorMsg = error;
            }
            else if (error != null && error.hasOwnProperty('message')) {
                errorMsg = error.message
            }
            else {
                errorMsg = 'unknown error'
            }
            res.redirect('/link?error=' + encodeURI(errorMsg as string));
        });
})

export = router;
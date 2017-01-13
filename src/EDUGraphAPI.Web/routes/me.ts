import express = require('express');
import jwt = require('jsonwebtoken');
import { Constants } from '../constants';
import { UserService } from '../services/userService';
import { TokenCacheService } from '../services/tokenCacheService';
import { TokenUtils } from '../utils/tokenUtils'

var router = express.Router();
var userService = new UserService();

router.get('/', function (req, res) {
        var u = req.user;
        if (u.authType == 'O365') {
            var retUser;
            userService.getUserModel({ o365UserId: u.oid })
                .then(user => {
                    if (user == null) {
                        return userService.getO365User(u.oid, u._json.tid)
                            .then(user => {
                                user.areAccountsLinked = false;
                                user.authType = u.authType;
                                retUser = user;
                                return userService.validUserHasSameEmail(retUser.o365Email);
                            })
                            .then((ret) => {
                                retUser.hasSameNameLocalAccount = ret;
                                return retUser;
                            })
                    }
                    else {
                        user.areAccountsLinked = true;
                        user.authType = u.authType;
                        return user;
                    }
                })
                .then(usermodel => { res.json(usermodel); })
                .catch(error => res.json(500, { error: error }));
        }
        else {
            userService.getUserModel({ id: u.id })
                .then(user => {
                    user.authType = u.authType;
                    user.areAccountsLinked =
                        user.o365UserId != null && user.o365UserId != ''
                        && user.o365Email != null && user.o365Email != '';
                    res.json(user);
                })
                .catch(error => res.json(500, { error: error }));
        }
    })

router.post('/favoriteColor', function (req, res) {
    var user = req.body;
    userService.updateFavoriteColor(user.id, user.favoriteColor)
        .then(user => res.json(user))
        .catch(error => res.json(500, { error: error }));
});

router.get('/accessToken', function (req, res) {
    if (req.isAuthenticated()) {
        let oid = req.user.oid;
        if (oid != null) {
            var tokenCache = new TokenCacheService();
            switch (req.query["resource"]) {
                case Constants.MSGraphResource:
                    tokenCache.getMSGraphToken(oid)
                        .then((result) => res.json(result))
                        .catch(error => res.json(500, { error: error }));
                    break;
                case Constants.AADGraphResource:
                    tokenCache.getAADAccessToken(oid)
                        .then((result) => res.json(result))
                        .catch(error => res.json(500, { error: error }));
                    break;
                default:
                    res.json(null);
                    break;
            }
        }
        else {
            res.json(null);
        }

    }
    else {
        res.json(401, { error: "401 unauthorized" });
    }
});

router.post('/O365UserLogin', function (req, res) {
    var redirectUrl = req.query.redirectUrl || '/schools';
    var idToken = jwt.decode(req.body.id_token);
    var tentantId = idToken.tid;
    var code = req.body.code;

    let accessToken: string;
    let tokenService = new TokenCacheService();
    var localUser = req.user;
    localUser.oid = idToken.oid;
    localUser.tid = tentantId; 

    TokenUtils.getTokenByCode(code, tentantId, Constants.MSGraphResource, 'api/me/O365UserLogin')
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
            res.redirect('/link-loginO365Requried?error=' + encodeURI(errorMsg as string));
        });
})

export = router;